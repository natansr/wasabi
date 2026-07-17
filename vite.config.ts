import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['wasabi-logo.png', 'wasabi-icon.png', 'scopus-export-menu.png', 'scopus-export-fields.png'],
      manifest: {
        name: 'Wasabi — Workflow for Systematic and Bibliometric Integrated Analysis',
        short_name: 'Wasabi',
        description: 'Bibliometric review and scientific mapping in the browser',
        theme_color: '#153e35',
        background_color: '#f7faf8',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'wasabi-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json,woff,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  base: './',
  build: {
    chunkSizeWarningLimit: 600,
  },
});
