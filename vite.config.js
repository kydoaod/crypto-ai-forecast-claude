import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      // 'autoUpdate' = when a new build is available, the updated service worker installs automatically
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],

      manifest: {
        name: 'Crypto AI Forecaster',
        short_name: 'CryptoAI',
        description: 'Live top-5 crypto prices with AI-generated market sentiment forecasts.',
        theme_color: '#0a0b10',
        background_color: '#0a0b10',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      // Allow PWA features (manifest + SW) during `npm run dev`,
      // so Add to Home Screen can be tested while running the dev server.
      devOptions: {
        enabled: true,
        type: 'module',
      },

      workbox: {
        // Offline navigation (e.g. reopening the app without internet)
        // returns the cached app shell (index.html) instead of the native
        // browser offline error. This is the PWA offline fallback.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          {
            // Live prices: try network first (for freshness), but if
            // offline use the most recent cached response.
            urlPattern: /^https:\/\/api\.coingecko\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'coingecko-prices',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 10 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // AI forecasts should always be fresh/live - do not cache.
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
