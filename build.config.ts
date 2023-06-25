import { defineBuildConfig } from 'unbuild'
import pkg from './package.json'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/module', format: 'esm' },
    { input: 'src/runtime/', outDir: 'dist/runtime' },
  ],
  externals: [
    'nuxt',
    '@nuxt/schema',
    '@nuxt/kit',
    'vite',
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  rollup: {
    inlineDependencies: true,
  },
})
