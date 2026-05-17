/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SITE_URL: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_HOTJAR_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

// Google Analytics
interface Window {
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[]
  __LIOX_HOME_PAGE_CONTENT__?: Record<string, unknown> | null
  __LIOX_ANNOUNCEMENT__?: Record<string, unknown> | null
  __LIOX_BOOTSTRAP_PROMISE__?: Promise<void>
}
