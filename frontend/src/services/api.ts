import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'
import { getRecaptchaPayload } from '@/lib/recaptcha'

const UTM_STORAGE_KEY = 'liox_utm_params'
const CLICK_ID_STORAGE_KEY = 'liox_click_ids'

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

export function unwrapApiData<T>(payload: unknown, fallback: T): T {
  if (Array.isArray(payload)) {
    return payload as T
  }

  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return ((payload as Record<string, unknown>).data as T) ?? fallback
  }

  return (payload as T) ?? fallback
}

export async function getSiteSettings() {
  const response = await api.get('/global/settings')
  return response.data
}

/**
 * Add response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

/**
 * Get UTM parameters from URL
 */
export function getUtmParams() {
  const params = new URLSearchParams(window.location.search)
  const current = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined,
  }

  const hasCurrentValues = Object.values(current).some(Boolean)

  if (hasCurrentValues) {
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(current))
    } catch {
      // noop
    }

    return current
  }

  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // noop
  }

  return current
}

export function getClickIds() {
  const params = new URLSearchParams(window.location.search)
  const current = {
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
  }

  const hasCurrentValues = Object.values(current).some(Boolean)

  if (hasCurrentValues) {
    try {
      window.sessionStorage.setItem(CLICK_ID_STORAGE_KEY, JSON.stringify(current))
    } catch {
      // noop
    }

    return current
  }

  try {
    const stored = window.sessionStorage.getItem(CLICK_ID_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // noop
  }

  return {
    gclid: undefined,
    fbclid: undefined,
  }
}

/**
 * Get current page path
 */
export function getCurrentPath() {
  return window.location.pathname
}

/**
 * Submit lead form
 */
export async function submitLead(data: {
  name: string
  email: string
  tel?: string
  company?: string
  employee_count?: string
  variant_id?: string
}) {
  const recaptcha = await getRecaptchaPayload('lead_submit')

  return api.post('/crm/lead', {
    ...data,
    ...recaptcha,
    path: getCurrentPath(),
    utm: {
      ...getUtmParams(),
      ...getClickIds(),
    },
  })
}

/**
 * Submit assessment form
 */
export async function submitAssessment(data: {
  name: string
  email: string
  tel?: string
  company?: string
  employee_count?: string
  sector?: string
  current_erp?: string
  current_challenges?: string
  goals?: string
  budget_range?: string
  timeline?: string
}) {
  const recaptcha = await getRecaptchaPayload('assessment_submit')

  return api.post('/assessment', {
    ...data,
    ...recaptcha,
    path: getCurrentPath(),
    utm: {
      ...getUtmParams(),
      ...getClickIds(),
    },
  })
}

/**
 * Submit appointment request
 */
export async function submitAppointment(data: {
  name: string
  email: string
  tel?: string
  company?: string
  preferred_date: string
  preferred_time?: string
  sector?: string
  notes?: string
}) {
  const recaptcha = await getRecaptchaPayload('appointment_submit')

  return api.post('/appointment', {
    ...data,
    ...recaptcha,
    path: getCurrentPath(),
    utm: {
      ...getUtmParams(),
      ...getClickIds(),
    },
  })
}

/**
 * Track event
 */
export async function trackEvent(event: string, data?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.log('Event tracked:', event, data)
  }

  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({ event, ...data })
  }

  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event, data)

    if (event === 'liox_lead_submit') {
      window.gtag('event', 'generate_lead', data)
    }
  }
}

export interface HomePageContent {
  page_type?: string
  title?: string
  seo_title?: string
  seo_description?: string
  seo_enabled?: boolean
  seo_site_name_mode?: string
  seo_site_name_custom?: string
  seo_site_name_position?: string
  seo_site_name_separator?: string
  robots?: string[]
  seo_keywords?: string[]
  og_title?: string
  og_description?: string
  og_image?: string
  x_title?: string
  x_description?: string
  x_handle?: string
  canonical_url?: string
  schema_type?: string
  sitemap_enabled?: boolean
  sitemap_priority?: string
  sitemap_change_frequency?: string
  structured_data_items?: Array<Record<string, unknown>>
  resolved_seo?: Record<string, unknown>
  structured_data?: Array<Record<string, unknown>>
  hero_baslik?: string
  hero_alt_baslik?: string
  hero_aciklama?: string
  hero_gorsel?: string
  hero_video_embed?: string
  moduller_baslik?: string
  moduller_alt_baslik?: string
  moduller_goster?: boolean
  moduller?: Array<Record<string, unknown>>
  sektorler_baslik?: string
  sektorler_aciklama?: string
  sektorler_goster?: boolean
  sektor_tableri?: Array<Record<string, unknown>>
  basari_baslik?: string
  basari_goster?: boolean
  video_baslik?: string
  video_alt_baslik?: string
  video_embed_url?: string
  video_goster?: boolean
  video_slider_items?: Array<Record<string, unknown>>
  roller_goster?: boolean
  roller_baslik?: string
  roller_aciklama?: string
  role_profiles?: Array<Record<string, unknown>>
  mobil_goster?: boolean
  mobil_baslik?: string
  mobil_aciklama?: string
  mobil_gorsel_url?: string
  mobil_ozellikler?: Array<Record<string, unknown>>
  cta_baslik?: string
  cta_aciklama?: string
  cta_buton_metin?: string
  cta_goster?: boolean
  generic_goster?: boolean
  generic_hero_baslik?: string
  generic_hero_aciklama?: string
  generic_content_blocks?: Array<Record<string, unknown>>
}

export async function getHomePageContent() {
  const response = await api.get<HomePageContent>('/page/home')
  return response.data
}

export async function getPageContent(slug: string) {
  const response = await api.get<HomePageContent>(`/page/${slug}`)
  return response.data
}

export default api
