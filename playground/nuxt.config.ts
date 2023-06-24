import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
import laravelEchoNuxtModule from '../src/module'
import type { EchoOptions } from '../src/types'

export default defineNuxtConfig({
  modules: [laravelEchoNuxtModule],
  echo: {
    broadcaster: 'pusher',
    key: 'app-key',
    wsHost: 'localhost',
    wsPort: 80,
    wssPort: 443,
    cluster: 'eu',
  } as EchoOptions,
  runtimeConfig: {
    public: {
      pusherKey: process.env.NUXT_PUSHER_APP_KEY,
      pusherHost: process.env.NUXT_PUSHER_HOST,
      pusherPort: process.env.NUXT_PUSHER_PORT,
      pusherScheme: process.env.NUXT_PUSHER_SCHEME,
    },
  },
  nitro: {
    rootDir: resolve(__dirname, '.'),
  },
})
