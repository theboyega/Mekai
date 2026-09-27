import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Disable Express server fingerprinting
app.disable('x-powered-by');

// Mekai production n8n webhook endpoint
const MEKAI_WEBHOOK_URL =
  'https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const UNREACHABLE_LIMIT_MESSAGE =
  "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions.";

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
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const chatInput = sanitizeText(body.chatInput || body.message, 12000);
    const sessionId = sanitizeText(body.sessionId, 128) || `mekai-session-${Date.now()}`;
    const technicianName = sanitizeText(body.technicianName, 100) || 'Technician';
    const activeCode = sanitizeText(body.activeCode, 32).toUpperCase() || 'CST-ACTIVE-WORKSHOP';

    const upstreamBody = {
      action: 'sendMessage',
      chatInput,
      message: chatInput,
      sessionId,
      technicianName,
      activeCode,
    };

    // Forward directly to the Mekai n8n webhook endpoint with 60s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const upstreamResponse = await fetch(MEKAI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(upstreamBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Only return the daily limit message when Mekai cannot be reached or upstream fails
    if (!upstreamResponse.ok) {
      return res.status(200).json({
        output: UNREACHABLE_LIMIT_MESSAGE,
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
          output: UNREACHABLE_LIMIT_MESSAGE,
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
        output: UNREACHABLE_LIMIT_MESSAGE,
        limitReached: true,
      });
    }
    return res.status(200).json({ output: text });
  } catch {
    // Mekai endpoint could not be reached (network error / timeout)
    return res.status(200).json({
      output: UNREACHABLE_LIMIT_MESSAGE,
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
