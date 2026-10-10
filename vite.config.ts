import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'CodeQuest Kids',
        short_name: 'CodeQuest',
        description: 'Aprende programación jugando, misión a misión.',
        theme_color: '#7868e6',
        background_color: '#f5f4ff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              debugName: 'CodeMirror editor packages',
              name: (moduleId) => {
                const packageName = moduleId.match(
                  /node_modules[\\/](?:@[^\\/]+[\\/])?([^\\/]+)/,
                )?.[1];
                return packageName ? `editor-${packageName}` : 'editor-core';
              },
              test: /node_modules[\\/](?:@uiw|@codemirror|@lezer|codemirror)[\\/]/,
              priority: 20,
            },
            {
              name: 'react-core',
              test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 15,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/test/**', '**/*.test.{ts,tsx}', 'src/data/**'],
    },
  },
});
