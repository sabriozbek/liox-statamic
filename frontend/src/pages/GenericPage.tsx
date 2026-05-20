import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getPageContent, type HomePageContent } from '@/services/api'
import GenericContentPage from '@/components/pages/GenericContentPage'
import { getRoutePayload } from '@/ssr/useRoutePayload'

const PAGE_TITLE_MAP: Record<string, string> = {
  'neden-lioxerp': 'Neden LIOXERP',
  'gizlilik-politikasi': 'Gizlilik Politikası',
  'kullanim-sartlari': 'Kullanım Şartları',
  kvkk: 'KVKK',
}

interface GenericPageProps {
  fixedSlug?: string
}

export default function GenericPage({ fixedSlug }: GenericPageProps) {
  const params = useParams()
  const slug = fixedSlug || params.slug || ''
  const ssrPayload = getRoutePayload<HomePageContent>(`page:${slug}`)
  const [content, setContent] = useState<HomePageContent | null>(() => ssrPayload)
  const [loading, setLoading] = useState(true)
  const fallbackTitle = PAGE_TITLE_MAP[slug] || 'LIOXERP'

  useEffect(() => {
    const payload = getRoutePayload<HomePageContent>(`page:${slug}`)

    if (payload) {
      setContent(payload)
      setLoading(false)
      return
    }

    setContent(null)
    setLoading(true)
    getPageContent(slug)
      .then((data) => setContent(data))
      .catch(() => setContent(null))
      .finally(() => setLoading(false))
  }, [slug])

  return <GenericContentPage content={content} loading={loading} fallbackTitle={fallbackTitle} />
}
