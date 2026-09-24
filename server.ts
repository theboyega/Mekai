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

// Server-side direct proxy to n8n webhook (no failover/model fallbacks)
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

    const contentType = upstreamResponse.headers.get('content-type') || '';
    res.status(upstreamResponse.status);

    if (contentType.includes('application/json')) {
      const data = await upstreamResponse.json();
      return res.json(data);
    }

    const text = await upstreamResponse.text();
    return res.send(text);
  } catch (error: any) {
    console.error('[Mekai n8n Proxy] Error connecting to upstream webhook:', error);
    if (error?.name === 'AbortError') {
      return res.status(504).json({
        error: 'The Mekai diagnostic engine timed out waiting for n8n response.',
      });
    }
    return res.status(502).json({
      error: `Unable to reach Mekai n8n diagnostic engine: ${error?.message || 'Network connection failed'}.`,
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
