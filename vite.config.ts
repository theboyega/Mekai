import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const webhookUrl = process.env.MEKAI_WEBHOOK_URL;
  const webhookParsed = webhookUrl ? new URL(webhookUrl) : null;
  const targetHost = webhookParsed ? webhookParsed.origin : 'https://mekai-ai.app.n8n.cloud';
  const targetPath = webhookParsed ? webhookParsed.pathname : '/webhook/5b01dd02-7501-46e9-ba90-f890e6a1c2bf/chat';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      outDir: 'dist',
      target: 'esnext',
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'icons-vendor';
            }
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      proxy: {
        '/api/chat-webhook': {
          target: targetHost,
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/chat-webhook/, targetPath),
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
