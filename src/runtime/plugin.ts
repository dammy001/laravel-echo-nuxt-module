// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
import Echo from 'laravel-echo'
import type { Plugin } from 'nuxt/app'
import Pusher from 'pusher-js'
// @ts-expect-error tsconfig
import { defineNuxtPlugin } from '#imports'
// @ts-expect-error tsconfig
import { options } from '#nuxt-echo-options'

declare global {
  interface Window {
    Pusher: typeof Pusher
    io: any
    Echo: Echo
  }
}

export default defineNuxtPlugin((nuxt: any) => {
  if (options?.broadcaster === 'pusher' && !options?.encrypted) {
    if (!window.Pusher) window.Pusher = Pusher
  }

  if (options?.broadcaster === 'socket.io') {
    if (!window.Pusher) window.io = require('socket.io')
  }

  window.Echo = new Echo({ ...options })

  nuxt.vueApp.config.globalProperties.$echo as Echo
  nuxt.vueApp.echo = window.Echo

  return {
    provide: {
      echo: window.Echo,
    },
  }
}) as Plugin<{ echo: Echo }>
