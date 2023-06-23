import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const distDir = resolve(fileURLToPath(import.meta.url), '..')
export const runtimeDir = resolve(distDir, 'runtime')
