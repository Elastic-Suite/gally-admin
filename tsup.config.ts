import { defineConfig } from 'tsup'

export default defineConfig([
  // Main bundle
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist',
  },
  // Browser bundle
  {
    entry: { index: 'src/browser.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/browser',
  },
])
