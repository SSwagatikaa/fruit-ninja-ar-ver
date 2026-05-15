import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'src/assets/**/*'],
      manifest: {
        name: 'AR Fruit Ninja',
        short_name: 'Fruit Ninja',
        description: 'Slice fruits in AR using your finger or cursor!',
        theme_color: '#ff8800',
        background_color: '#0a0a0a',
        display: 'fullscreen',
        orientation: 'landscape',
        icons: [
          {
            src: 'src/assets/hero.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'src/assets/hero.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})