import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'
// import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  // adapter: cloudflare({ mode: 'advanced' }),
  vite: {
    define: {
      'process.env.TMDB_API_KEY': JSON.stringify(process.env.TMDB_API_KEY),
    },
  },
})
