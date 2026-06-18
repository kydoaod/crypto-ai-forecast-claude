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
      // 'autoUpdate' = bagong build, auto na mag-i-install ang updated service worker
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],

      manifest: {
        name: 'Crypto AI Forecaster',
        short_name: 'CryptoAI',
        description: 'Live top-5 crypto prices na may AI-generated market sentiment forecast.',
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

      // Pinapayagan din ang PWA features (manifest + SW) habang `npm run dev`,
      // para makapag-test agad ng "Add to Home Screen" kahit dev server lang.
      devOptions: {
        enabled: true,
        type: 'module',
      },

      workbox: {
        // Pag-navigate offline (hal. binuksan ulit ang app na walang internet),
        // ibibigay ang naka-cache na app shell (index.html) sa lugar ng native
        // browser offline error. Ito ang "offline fallback" ng PWA.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          {
            // Live prices: i-try muna ang network (para sariwa), pero kung
            // walang internet, gamitin ang pinaka-huling cached response.
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
            // AI forecasts dapat laging fresh/live - hindi dapat i-cache.
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
