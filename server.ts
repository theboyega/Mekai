import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize GoogleGenAI client if API key is configured
let geminiAi: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAi = new GoogleGenAI();
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Disable Express server fingerprinting
app.disable('x-powered-by');

// Mekai production n8n webhook endpoint
const MEKAI_WEBHOOK_URL =
  process.env.MEKAI_WEBHOOK_URL ||
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

// Fallback to Gemini when upstream n8n workflow is unavailable or errors
async function generateDiagnosticWithGemini(
  chatInput: string,
  technicianName: string,
  activeCode: string
): Promise<string | null> {
  if (!geminiAi && process.env.GEMINI_API_KEY) {
    try {
      geminiAi = new GoogleGenAI();
    } catch {
      return null;
    }
  }
  if (!geminiAi) return null;

  const systemInstruction = `You are Mekai, an automotive diagnostic intelligence engine built for master technicians, workshop engineers, and mechanics.
Active technician: ${technicianName} (Workshop code: ${activeCode}).
Provide direct, technically rigorous, highly actionable diagnostic intelligence for automotive faults, DTCs, component tests, and wiring/CAN issues.
Structure your diagnosis clearly:
1. Probable Root Causes & Fault Hypotheses
2. Diagnostic Steps & Multimeter/Scope/PID Checks
3. Component Testing & Verification
4. Potential TSBs or Safety Considerations

Be concise, technical, precise, and authoritative.`;

  try {
    const response = await geminiAi.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: chatInput,
      config: {
        systemInstruction,
      },
    });
    if (response?.text) return response.text;
  } catch (err) {
    console.warn('Primary Gemini model call failed, trying fallback model:', err);
    try {
      const fallback = await geminiAi.models.generateContent({
        model: 'gemini-flash-latest',
        contents: chatInput,
        config: {
          systemInstruction,
        },
      });
      if (fallback?.text) return fallback.text;
    } catch (fallbackErr) {
      console.warn('Gemini fallback model call failed:', fallbackErr);
    }
  }
  return null;
}

// Server-side direct proxy to Mekai n8n webhook with Gemini intelligence fallback
app.post('/api/chat-webhook', async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const chatInput =
    sanitizeText(body.chatInput || body.message || body.prompt, 12000) ||
    'Automotive diagnostic consultation';
  const sessionId = sanitizeText(body.sessionId, 128) || `mekai-session-${Date.now()}`;
  const technicianName = sanitizeText(body.technicianName, 100) || 'Technician';
  const activeCode = sanitizeText(body.activeCode, 32).toUpperCase() || 'CST-ACTIVE-WORKSHOP';

  try {
    const upstreamBody = {
      action: 'sendMessage',
      chatInput,
      message: chatInput,
      sessionId,
      technicianName,
      activeCode,
    };

    // Forward to the Mekai n8n webhook endpoint with fast 3.5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

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

    if (upstreamResponse.ok) {
      const contentType = upstreamResponse.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await upstreamResponse.json();
        const isWorkflowError =
          (data && typeof data === 'object' && (data.message === 'Error in workflow' || (typeof data.message === 'string' && data.message.includes('problem executing')))) ||
          (Array.isArray(data) && (data[0]?.message === 'Error in workflow' || (typeof data[0]?.message === 'string' && data[0]?.message.includes('problem executing'))));

        if (!isWorkflowError) {
          return res.status(200).json(data);
        }
      } else {
        const text = await upstreamResponse.text();
        if (
          text &&
          !text.includes('Error in workflow') &&
          !text.includes('problem executing') &&
          !text.trim().toLowerCase().startsWith('<!doctype html') &&
          !text.trim().toLowerCase().startsWith('<html')
        ) {
          return res.status(200).json({ output: text });
        }
      }
    }
  } catch (upstreamErr) {
    console.warn('Upstream webhook request failed or timed out:', upstreamErr);
  }

  // Upstream webhook failed, timed out, or returned an execution error.
  // Fall back to server-side Gemini intelligence engine.
  const geminiOutput = await generateDiagnosticWithGemini(chatInput, technicianName, activeCode);
  if (geminiOutput) {
    return res.status(200).json({
      output: geminiOutput,
    });
  }

  // If neither upstream nor Gemini succeeded, return daily limit message
  return res.status(200).json({
    output: UNREACHABLE_LIMIT_MESSAGE,
    limitReached: true,
  });
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
