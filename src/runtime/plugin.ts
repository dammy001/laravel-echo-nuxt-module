// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'
// import SocketIO from 'socket.io'
// @ts-expect-error tsconfig
import { defineNuxtPlugin, useNuxtApp } from '#imports'

declare global {
  interface Window {
    // Pusher: typeof Pusher
    // io: typeof SocketIO
    Echo: Echo
  }
}

export default defineNuxtPlugin((nuxt: any) => {
  // if (options?.broadcaster === 'pusher' && !options?.encrypted) {
  //   if (!window.Pusher) window.Pusher = Pusher
  // }

  // if (options?.broadcaster === 'socket.io') {
  //   if (!window.Pusher) window.io = SocketIO
  // }

  window.Echo = new Echo({})

  nuxt.vueApp.config.globalProperties.$echo as Echo
  nuxt.vueApp.echo = window.Echo

  return {
    provide: {
      echo: window.Echo,
    },
  }
})
