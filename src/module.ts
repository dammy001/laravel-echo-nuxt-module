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
import { runtimeDir } from './dirs'
import type { Arrayable, ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'laravel-echo-nuxt-module',
    configKey: 'echo',
    compatibility: {
      nuxt: '>=3',
    },
  },
  defaults: () => ({
    options: {
      broadcaster: 'null',
      encrypted: false,
      enabledTransports: ['ws', 'wss'],
      port: 6001,
    },
  }),
  setup: async (options, nuxt) => {
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
