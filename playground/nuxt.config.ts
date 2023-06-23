import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
import laravelEchoNuxtModule from '../src/module'

export default defineNuxtConfig({
  modules: [laravelEchoNuxtModule],
  echo: {
    options: {
      broadcaster: 'pusher',
    },
  },
  nitro: {
    rootDir: resolve(__dirname, '.'),
  },
})
