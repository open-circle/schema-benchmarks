import type { VitePWAOptions } from "vite-plugin-pwa";

function days(count: number) {
  return 60 * 60 * 24 * count;
}

export default {
  registerType: "autoUpdate",
  includeAssets: [
    "fonts/*.woff2",
    "bench.json",
    "stack.json",
    "download.json",
    "offline/index.html",
    "offline/index.css",
    "*.svg",
    "*.ico",
    "*.png",
  ],
  manifest: {
    background_color: "#eceff1",
    display: "standalone",
    icons: [
      {
        sizes: "64x64 32x32 24x24 16x16",
        src: "favicon_dark.ico",
        type: "image/x-icon",
      },
      {
        sizes: "192x192",
        src: "logo192_dark.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "logo512_dark.png",
        type: "image/png",
      },
    ],
    name: "Schema Benchmarks",
    short_name: "Schema Benchmarks",
    start_url: ".",
    theme_color: "#21222c",
  },
  workbox: {
    navigateFallback: null,
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: days(1),
          },
          precacheFallback: {
            fallbackURL: "offline/index.html",
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: days(365),
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "gstatic-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: days(365),
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
} satisfies Partial<VitePWAOptions>;
