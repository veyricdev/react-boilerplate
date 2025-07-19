import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import devtoolsJson from 'vite-plugin-devtools-json'
import dayjs from 'dayjs'

import pkg from './package.json'

const CWD = process.cwd()

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

export default defineConfig(({ mode }: ConfigEnv) => {
  const { PORT, PORT_PREVIEW, VITE_DROP_CONSOLE } = loadEnv(mode, CWD)

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
    esbuild: {
      pure: VITE_DROP_CONSOLE === 'true' ? ['console.log'] : [],
      drop: VITE_DROP_CONSOLE === 'true' ? ['debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      target: 'es2015',
      minify: 'esbuild',
      cssTarget: 'chrome80',
      chunkSizeWarningLimit: 2000,
    },
    plugins: [devtoolsJson(), tailwindcss(), reactRouter(), tsconfigPaths()],
  } as UserConfig
})
