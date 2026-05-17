declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY

let scriptLoadingPromise: Promise<void> | null = null

function loadRecaptchaScript(): Promise<void> {
  if (!SITE_KEY) {
    return Promise.resolve()
  }

  if (window.grecaptcha) {
    return Promise.resolve()
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-recaptcha="v3"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA script yüklenemedi')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    script.defer = true
    script.dataset.recaptcha = 'v3'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('reCAPTCHA script yüklenemedi'))
    document.head.appendChild(script)
  })

  return scriptLoadingPromise
}

export async function getRecaptchaPayload(action: string): Promise<{ recaptcha_token?: string; recaptcha_action?: string }> {
  if (!SITE_KEY) {
    return {}
  }

  await loadRecaptchaScript()

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA kullanılamıyor')
  }

  const token = await new Promise<string>((resolve, reject) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha?.execute(SITE_KEY, { action })
        .then(resolve)
        .catch(() => reject(new Error('reCAPTCHA token üretilemedi')))
    })
  })

  return {
    recaptcha_token: token,
    recaptcha_action: action,
  }
}
