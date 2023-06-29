// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-expressions */
import { join } from 'node:path'
import {
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
} from '@nuxt/kit'
import { searchForWorkspaceRoot } from 'vite'
import defu from 'defu'
import { runtimeDir } from './dirs'
import type { ModuleOptions } from './types'

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
    // @ts-expect-error - module options
    nuxt.options.echo = defu(nuxt.options.echo || {}, options)

    const resolver = createResolver(import.meta.url)

    // Inject options via virtual template
    nuxt.options.alias['#nuxt-echo-options'] = addTemplate({
      filename: 'echo-options.mjs',
      getContents: () =>
        Object.entries(options)
          .map(
            ([key, value]) =>
              `export const ${key} = ${JSON.stringify(value, null, 2)}
      `,
          )
          .join('\n'),
    }).dst

    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    addPlugin({
      src: join(runtimeDir, 'plugin.ts'),
      mode: 'client',
    })

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(join(runtimeDir, 'composables'))
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
