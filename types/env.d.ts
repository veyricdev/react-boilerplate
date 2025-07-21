/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PORT: string
  readonly PORT_PREVIEW: string
  readonly VITE_APP_TITLE: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_BASE_URL_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
