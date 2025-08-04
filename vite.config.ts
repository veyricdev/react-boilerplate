import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import dayjs from 'dayjs'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json'

const CWD = process.cwd()

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

export default defineConfig(({ mode }: ConfigEnv) => {
  const { PORT, PORT_PREVIEW, VITE_DROP_CONSOLE } = loadEnv(mode, CWD)

  const isProd = mode === 'production'

  return {
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      devSourcemap: true,
    },
    server: {
      port: parseInt(PORT || '5173'),
    },
    preview: {
      port: parseInt(PORT_PREVIEW || '3000'),
    },
    plugins: [
      devtoolsJson(),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),

      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ],
    esbuild: {
      pure: VITE_DROP_CONSOLE === 'true' ? ['console.log'] : [],
      drop: VITE_DROP_CONSOLE === 'true' ? ['debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router', 'axios', 'dayjs'],
    },
    build: {
      target: 'es2015',
      minify: 'esbuild',
      cssTarget: 'chrome80',
      sourcemap: !isProd,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 2000,
    },
  } as UserConfig
})
