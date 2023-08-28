import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    include: ['src/**/*.e2e.spec.ts'],
    root: './',
    setupFiles: ['./src/tests/setup-e2e-tests.ts'],
  },
})
