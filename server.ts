import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Resolve webhook endpoint securely from server environment variable
const MEKAI_WEBHOOK_URL = process.env.MEKAI_WEBHOOK_URL || 'https://mekai-ai.app.n8n.cloud/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side secure proxy for Mekai agent chat
app.post('/api/chat-webhook', async (req, res) => {
  try {
    const upstreamResponse = await fetch(MEKAI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    res.status(upstreamResponse.status);

    if (contentType.includes('application/json')) {
      const data = await upstreamResponse.json();
      return res.json(data);
    }

    const text = await upstreamResponse.text();
    return res.send(text);
  } catch (error) {
    console.error('[Mekai Proxy] Request failed:', error);
    return res.status(502).json({
      error: 'Failed to communicate with Mekai diagnostic agent upstream',
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
