const API_BASE_URL = process.env.VITE_API_URL || 'https://liox-app-1084795151663.europe-west1.run.app/api'

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function preloadRouteData(url) {
  const cleanUrl = url.split('?')[0]

  if (cleanUrl === '/') {
    return [{ key: 'home', data: await fetchJson('/page/home') }]
  }

  if (cleanUrl === '/neden-lioxerp') {
    return [{ key: 'page:neden-lioxerp', data: await fetchJson('/page/neden-lioxerp') }]
  }

  if (cleanUrl === '/gizlilik-politikasi') {
    return [{ key: 'page:gizlilik-politikasi', data: await fetchJson('/page/gizlilik-politikasi') }]
  }

  if (cleanUrl === '/kullanim-sartlari') {
    return [{ key: 'page:kullanim-sartlari', data: await fetchJson('/page/kullanim-sartlari') }]
  }

  if (cleanUrl === '/kvkk') {
    return [{ key: 'page:kvkk', data: await fetchJson('/page/kvkk') }]
  }

  if (cleanUrl === '/iletisim') {
    return [{ key: 'page:iletisim', data: await fetchJson('/page/iletisim') }]
  }

  if (cleanUrl === '/tesekkurler') {
    return [{ key: 'page:tesekkurler', data: await fetchJson('/page/tesekkurler') }]
  }

  if (cleanUrl === '/blog') {
    const [posts, categories, tags] = await Promise.all([
      fetchJson('/blog'),
      fetchJson('/blog/categories'),
      fetchJson('/blog/tags'),
    ])

    return [
      { key: 'blog:index', data: posts },
      { key: 'blog:categories', data: categories },
      { key: 'blog:tags', data: tags },
    ]
  }

  return []
}
