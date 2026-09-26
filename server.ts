import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Mekai production n8n webhook endpoint
const MEKAI_WEBHOOK_URL =
  process.env.MEKAI_WEBHOOK_URL ||
  'https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const DAILY_LIMIT_MESSAGE =
  "You've reached your diagnostic limit for today. Your credits will automatically refresh tomorrow at 8:00 AM, and you'll be ready to dive back into your workshop sessions.";

// Server-side direct proxy to n8n webhook
app.post('/api/chat-webhook', async (req, res) => {
  try {
    const upstreamBody = {
      action: 'sendMessage',
      ...req.body,
    };

    // Forward directly to the n8n webhook endpoint with 60s timeout for complex diagnostics
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
    if (!text || text.includes('Error in workflow')) {
      return res.status(200).json({
        output: DAILY_LIMIT_MESSAGE,
        limitReached: true,
      });
    }
    return res.status(200).send(text);
  } catch (_error: any) {
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
