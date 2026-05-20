import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getPageContent, type HomePageContent } from '@/services/api'
import GenericContentPage from '@/components/pages/GenericContentPage'

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
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const fallbackTitle = PAGE_TITLE_MAP[slug] || 'LIOXERP'

  useEffect(() => {
    setLoading(true)
    getPageContent(slug)
      .then((data) => setContent(data))
      .catch(() => setContent(null))
      .finally(() => setLoading(false))
  }, [slug])

  return <GenericContentPage content={content} loading={loading} fallbackTitle={fallbackTitle} />
}
