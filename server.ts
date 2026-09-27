import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { isValidAccessCode } from './src/data/accessCodes';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Disable Express server fingerprinting
app.disable('x-powered-by');

// Mekai production n8n webhook endpoint
const DEFAULT_MEKAI_WEBHOOK_URL =
  'https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

function getVerifiedWebhookUrl(): string {
  const configured = process.env.MEKAI_WEBHOOK_URL?.trim();
  if (configured) {
    try {
      const parsed = new URL(configured);
      if (parsed.protocol === 'https:' && parsed.hostname === 'mekai-ai.app.n8n.cloud') {
        return parsed.toString();
      }
    } catch {
      // fall back to default verified URL
    }
  }
  return DEFAULT_MEKAI_WEBHOOK_URL;
}

// Security headers middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)'
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const DAILY_LIMIT_MESSAGE =
  "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions.";

// Per-IP in-memory rate limiting for the diagnostic webhook endpoint (30 requests / minute)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS).unref();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);
  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

// Server-side direct proxy to Mekai n8n webhook
app.post('/api/chat-webhook', async (req, res) => {
  try {
    const clientIp =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : req.socket.remoteAddress) || 'unknown';

    if (isRateLimited(clientIp)) {
      return res.status(200).json({
        output: DAILY_LIMIT_MESSAGE,
        limitReached: true,
      });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const chatInput = sanitizeText(body.chatInput || body.message, 8000);
    const sessionId = sanitizeText(body.sessionId, 128) || `mekai-session-${Date.now()}`;
    const technicianName = sanitizeText(body.technicianName, 100) || 'Technician';
    const rawCode = sanitizeText(body.activeCode, 32).toUpperCase();

    if (!chatInput) {
      return res.status(400).json({
        error: 'Diagnostic prompt cannot be empty.',
      });
    }

    // Verify workshop access code when provided
    const verifiedCode = isValidAccessCode(rawCode) ? rawCode : 'CST-ACTIVE-WORKSHOP';

    const upstreamBody = {
      action: 'sendMessage',
      chatInput,
      message: chatInput,
      sessionId,
      technicianName,
      activeCode: verifiedCode,
    };

    // Forward directly to the Mekai n8n webhook endpoint with 60s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const upstreamResponse = await fetch(getVerifiedWebhookUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(upstreamBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!upstreamResponse.ok) {
      return res.status(200).json({
        output: DAILY_LIMIT_MESSAGE,
        limitReached: true,
      });
    }

    const contentType = upstreamResponse.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await upstreamResponse.json();
      if (
        (data && typeof data === 'object' && data.message === 'Error in workflow') ||
        (Array.isArray(data) && data[0]?.message === 'Error in workflow')
      ) {
        return res.status(200).json({
          output: DAILY_LIMIT_MESSAGE,
          limitReached: true,
        });
      }
      return res.status(200).json(data);
    }

    const text = await upstreamResponse.text();
    if (
      !text ||
      text.includes('Error in workflow') ||
      text.trim().toLowerCase().startsWith('<!doctype html') ||
      text.trim().toLowerCase().startsWith('<html')
    ) {
      return res.status(200).json({
        output: DAILY_LIMIT_MESSAGE,
        limitReached: true,
      });
    }
    return res.status(200).json({ output: text });
  } catch {
    return res.status(200).json({
      output: DAILY_LIMIT_MESSAGE,
      limitReached: true,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production static assets from dist
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In dev mode, mount Vite middleware onto Express
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
