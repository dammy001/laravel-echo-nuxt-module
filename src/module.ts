import { join } from 'node:path'
import {
  addPlugin,
  createResolver,
  defineNuxtModule,
  findPath,
  installModule,
} from '@nuxt/kit'
import { searchForWorkspaceRoot } from 'vite'
import defu from 'defu'
import type { Nuxt } from 'nuxt/schema'
import { runtimeDir } from './dirs'

export type Arrayable<T> = T | Array<T>

export type BroadcasterOption =
  | 'pusher'
  | 'socket.io'
  | 'null'
  | ((option: ModuleOptions) => void)

export type TransportOption = 'ws' | 'wss'

export interface ModuleOptions {
  /**
   * Pusher client.
   */
  Pusher?: (key: ModuleOptions['key'], options: ModuleOptions) => void

  broadcaster?: BroadcasterOption

  key?: string | null

  auth?: {
    headers?: {
      Authorization?: string
      [key: string]: string
    }
  }

  authEndpoint?: string

  userAuthentication?: {
    endpoint?: string
    headers?: Record<string, any>
  }

  csrfToken?: string | null

  bearerToken?: string | null

  host?: string | null

  namespace?: string | null

  wsHost?: string

  wsPort?: number

  wssPort?: number

  forceTLS?: boolean

  enabledTransports?: Array<TransportOption>

  encrypted?: boolean

  cluster?: string

  withoutInterceptors?: boolean

  client?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'laravel-echo-nuxt-module',
    configKey: 'echo',
    compatibility: {
      nuxt: '>=3',
    },
  },
  defaults: () => ({
    broadcaster: 'null',
    encrypted: false,
    enabledTransports: ['ws', 'wss'],
    port: 6001,
  }),
  setup: async (options: ModuleOptions, nuxt: Nuxt) => {
    const configPaths = []

    const addConfigPath = async (p: Arrayable<string>) => {
      const paths = (Array.isArray(p) ? p : [p]).filter(Boolean)
      for (const path of paths) {
        const resolvedPath = await findPath(
          path,
          { extensions: ['.js', '.cjs', '.mjs', '.ts', '.mts'] },
          'file',
        )
        // only if the path is found
        if (resolvedPath) {
          configPaths.push(resolvedPath)
        }
      }
    }

    // @ts-expect-error - module options
    nuxt.options.echo = defu(nuxt.options.echo || {}, options)

    const resolver = createResolver(import.meta.url)

    addPlugin({
      src: join(runtimeDir, 'plugin.ts'),
      mode: 'client',
    })

    nuxt.hook('vite:extendConfig', (config) => {
      config.server ||= {}
      config.server.fs ||= {}
      config.server.fs.allow ||= [searchForWorkspaceRoot(process.cwd())]

      config.server.watch ||= {}
      config.server.watch.ignored ||= []
      if (!Array.isArray(config.server.watch.ignored))
        config.server.watch.ignored = [config.server.watch.ignored]
      config.server.watch.ignored.push('**/.nuxt**')
    })

    await installModule(await resolver.resolvePath('@vueuse/nuxt'))
  },
})
