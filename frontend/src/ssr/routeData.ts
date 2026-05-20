import api from '@/services/api'
import { getHomePageContent, getPageContent } from '@/services/api'

export interface RouteDataPayload {
  key: string
  data: unknown
}

export async function preloadRouteData(url: string): Promise<RouteDataPayload[]> {
  const cleanUrl = url.split('?')[0]

  if (cleanUrl === '/') {
    const home = await getHomePageContent()
    return [{ key: 'home', data: home }]
  }

  if (cleanUrl === '/neden-lioxerp') {
    return [{ key: 'page:neden-lioxerp', data: await getPageContent('neden-lioxerp') }]
  }

  if (cleanUrl === '/gizlilik-politikasi') {
    return [{ key: 'page:gizlilik-politikasi', data: await getPageContent('gizlilik-politikasi') }]
  }

  if (cleanUrl === '/kullanim-sartlari') {
    return [{ key: 'page:kullanim-sartlari', data: await getPageContent('kullanim-sartlari') }]
  }

  if (cleanUrl === '/kvkk') {
    return [{ key: 'page:kvkk', data: await getPageContent('kvkk') }]
  }

  if (cleanUrl === '/iletisim') {
    return [{ key: 'page:iletisim', data: await getPageContent('iletisim') }]
  }

  if (cleanUrl === '/tesekkurler') {
    return [{ key: 'page:tesekkurler', data: await getPageContent('tesekkurler') }]
  }

  if (cleanUrl === '/blog') {
    const [posts, categories, tags] = await Promise.all([
      api.get('/blog').then(r => r.data),
      api.get('/blog/categories').then(r => r.data),
      api.get('/blog/tags').then(r => r.data),
    ])

    return [
      { key: 'blog:index', data: posts },
      { key: 'blog:categories', data: categories },
      { key: 'blog:tags', data: tags },
    ]
  }

  return []
}
