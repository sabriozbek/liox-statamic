import { useEffect } from 'react'

interface SeoManagerProps {
  title?: string | null
  description?: string | null
  canonicalUrl?: string | null
  robots?: string[] | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  xTitle?: string | null
  xDescription?: string | null
  xHandle?: string | null
  siteName?: string | null
  siteNamePosition?: string | null
  siteNameSeparator?: string | null
  enabled?: boolean | null
  structuredData?: Array<Record<string, unknown>> | null
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }

  el.setAttribute('content', content)
}

function upsertCanonical(url: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }

  el.setAttribute('href', url)
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.head.querySelector(`script[data-liox-seo="${id}"]`) as HTMLScriptElement | null

  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-liox-seo', id)
    document.head.appendChild(el)
  }

  el.textContent = JSON.stringify(data)
}

function removeManagedJsonLd() {
  document.head.querySelectorAll('script[data-liox-seo]').forEach((node) => node.remove())
}

export default function SeoManager({
  title,
  description,
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  xTitle,
  xDescription,
  xHandle,
  siteName,
  siteNamePosition,
  siteNameSeparator,
  enabled,
  structuredData,
}: SeoManagerProps) {
  useEffect(() => {
    if (enabled === false) {
      upsertMeta('robots', 'noindex,nofollow')
      document.title = title || 'LIOX ERP'
      removeManagedJsonLd()
      return
    }

    const separator = siteNameSeparator || '|'
    const fullTitle = title
      ? siteName
        ? siteNamePosition === 'before'
          ? `${siteName} ${separator} ${title}`
          : `${title} ${separator} ${siteName}`
        : title
      : siteName || 'LIOX ERP'

    document.title = fullTitle

    if (description) upsertMeta('description', description)
    if (canonicalUrl) upsertCanonical(canonicalUrl)
    if (robots?.length) upsertMeta('robots', robots.join(','))
    else upsertMeta('robots', 'index,follow')

    if (ogTitle || fullTitle) upsertMeta('og:title', ogTitle || fullTitle, 'property')
    if (ogDescription || description) upsertMeta('og:description', ogDescription || description || '', 'property')
    if (canonicalUrl) upsertMeta('og:url', canonicalUrl, 'property')
    if (ogImage) upsertMeta('og:image', ogImage, 'property')
    upsertMeta('og:type', 'website', 'property')

    if (xTitle || fullTitle) upsertMeta('twitter:title', xTitle || fullTitle)
    if (xDescription || description) upsertMeta('twitter:description', xDescription || description || '')
    if (ogImage) upsertMeta('twitter:image', ogImage)
    if (xHandle) upsertMeta('twitter:site', xHandle)
    upsertMeta('twitter:card', ogImage ? 'summary_large_image' : 'summary')

    removeManagedJsonLd()
    ;(structuredData || []).forEach((item, index) => {
      upsertJsonLd(`structured-${index}`, item)
    })
  }, [title, description, canonicalUrl, robots, ogTitle, ogDescription, ogImage, xTitle, xDescription, xHandle, siteName, siteNamePosition, siteNameSeparator, enabled, structuredData])

  return null
}
