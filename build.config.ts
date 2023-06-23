import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/module', format: 'esm' },
    { input: 'src/runtime/', outDir: 'dist/runtime' },
  ],
  externals: ['nuxt', 'fsevents', '@nuxt/schema', '@nuxt/kit', 'laravel-echo'],
})
