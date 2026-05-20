export interface SsrSeoState {
  title?: string
  description?: string
  canonicalUrl?: string
  robots?: string[] | null
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  xTitle?: string
  xDescription?: string
  xHandle?: string
  structuredData?: Array<Record<string, unknown>> | null
}

let currentSeoState: SsrSeoState = {}

export function resetSsrSeoState() {
  currentSeoState = {}
}

export function setSsrSeoState(state: SsrSeoState) {
  currentSeoState = state
}

export function renderSsrSeoTags() {
  const tags: string[] = []
  const fallbackTitle = currentSeoState.title || 'LioXERP - Akıllı ERP Çözümleri'
  const fallbackDescription = currentSeoState.description || 'LioXERP - Akıllı ERP Çözümleri'

  tags.push(`<title>${escapeHtml(fallbackTitle)}</title>`)
  tags.push(`<meta property="og:title" content="${escapeHtml(currentSeoState.ogTitle || fallbackTitle)}">`)
  tags.push(`<meta name="twitter:title" content="${escapeHtml(currentSeoState.xTitle || fallbackTitle)}">`)

  tags.push(`<meta name="description" content="${escapeHtml(fallbackDescription)}">`)
  tags.push(`<meta property="og:description" content="${escapeHtml(currentSeoState.ogDescription || fallbackDescription)}">`)
  tags.push(`<meta name="twitter:description" content="${escapeHtml(currentSeoState.xDescription || fallbackDescription)}">`)

  if (currentSeoState.canonicalUrl) {
    tags.push(`<link rel="canonical" href="${escapeHtml(currentSeoState.canonicalUrl)}">`)
    tags.push(`<meta property="og:url" content="${escapeHtml(currentSeoState.canonicalUrl)}">`)
  }

  if (currentSeoState.robots?.length) {
    tags.push(`<meta name="robots" content="${escapeHtml(currentSeoState.robots.join(','))}">`)
  }

  if (currentSeoState.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(currentSeoState.ogImage)}">`)
    tags.push(`<meta name="twitter:image" content="${escapeHtml(currentSeoState.ogImage)}">`)
    tags.push('<meta name="twitter:card" content="summary_large_image">')
  } else {
    tags.push('<meta name="twitter:card" content="summary">')
  }

  if (currentSeoState.xHandle) {
    tags.push(`<meta name="twitter:site" content="${escapeHtml(currentSeoState.xHandle)}">`)
  }

  tags.push('<meta property="og:type" content="website">')

  for (const item of currentSeoState.structuredData || []) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(item)}</script>`)
  }

  return tags.join('\n')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
