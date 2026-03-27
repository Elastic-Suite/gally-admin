import { defineConfig } from 'tsup'

export default defineConfig([
  // Main bundle
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist',
  },
  // Browser bundle (ES module, for import/bundler use)
  {
    entry: { index: 'src/browser.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/browser',
  },
  // Browser IIFE bundle (self-contained, for plain <script> tag use)
  {
    entry: { 'gally-sdk': 'src/browser.ts' },
    format: ['iife'],
    globalName: 'GallySDK',
    minify: true,
    outDir: 'dist/browser/iife',
  },
])
