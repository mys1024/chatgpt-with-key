import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import ResolveAlias from 'vite-plugin-easy-resolve-alias'
import { VitePWA } from 'vite-plugin-pwa'
import Unocss from 'unocss/vite'

export default defineConfig({
  plugins: [
    // https://github.com/mys1024/vite-plugin-easy-resolve-alias
    ResolveAlias({ '~/': 'src/' }),

    // https://github.com/vitejs/vite/tree/main/packages/plugin-vue
    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({ dirs: 'src/pages' }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Vitesse Light',
        short_name: 'Vitesse Light',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
  },
})
