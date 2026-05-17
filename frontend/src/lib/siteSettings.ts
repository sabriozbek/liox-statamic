export interface SiteSettingsPayload {
  site_name?: string
  site_email?: string
  site_phone?: string
  site_address?: string
  google_analytics_id?: string
  google_tag_manager_id?: string
  cta_variants?: Record<string, unknown>
  message_variants?: Record<string, unknown>
}

const SETTINGS_STORAGE_KEY = 'liox-site-settings'

export function storeSiteSettings(settings: SiteSettingsPayload) {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // noop
  }
}

export function getSiteSettings(): SiteSettingsPayload | null {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getCtaVariantsFromSettings(): Record<string, unknown> | null {
  return getSiteSettings()?.cta_variants && typeof getSiteSettings()?.cta_variants === 'object'
    ? (getSiteSettings()?.cta_variants as Record<string, unknown>)
    : null
}

export function getMessageVariantsFromSettings(): Record<string, unknown> | null {
  return getSiteSettings()?.message_variants && typeof getSiteSettings()?.message_variants === 'object'
    ? (getSiteSettings()?.message_variants as Record<string, unknown>)
    : null
}

export function injectGoogleTagManager(gtmId?: string | null) {
  if (!gtmId || typeof document === 'undefined') {
    return
  }

  if (document.querySelector(`script[data-gtm-id="${gtmId}"]`)) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  })

  const script = document.createElement('script')
  script.async = true
  script.dataset.gtmId = gtmId
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
  document.head.appendChild(script)
}
