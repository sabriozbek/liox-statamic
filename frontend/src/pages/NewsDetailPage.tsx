import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '@/services/api'
import StatamicRichContent from '@/components/content/StatamicRichContent'
import SeoManager from '@/components/seo/SeoManager'

interface NewsDetail {
  id: string
  slug: string
  title: string
  publish_date: string
  category?: string
  source_label?: string
  hero_badge?: string
  excerpt?: string
  featured_image?: string
  featured_image_alt?: string
  summary_points?: string[]
  content?: Array<{ type: string; text?: string; attrs?: { level?: number } }>
  related_links?: Array<{ label?: string; url?: string }>
  seo_title?: string
  seo_description?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  x_title?: string
  x_description?: string
  x_handle?: string
  robots?: string[]
  resolved_seo?: Record<string, any>
  structured_data?: Array<Record<string, unknown>>
}

export default function NewsDetailPage() {
  const { slug } = useParams()
  const [item, setItem] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    api.get<NewsDetail>(`/news/${slug}`)
      .then((response) => setItem(response.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Haber yükleniyor...</div>
  if (!item) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Haber bulunamadı.</div>

  const relatedSectionTitle = item.category?.toLowerCase().includes('ürün')
    ? 'İlgili Ürün Duyuruları'
    : item.source_label?.toLowerCase().includes('kurumsal')
      ? 'Kurumsal Duyurular'
      : 'İlgili Haberler'

  const relatedSectionEyebrow = item.category?.toLowerCase().includes('ürün')
    ? 'Ürün Güncellemeleri'
    : item.source_label?.toLowerCase().includes('kurumsal')
      ? 'Kurumsal İletişim'
      : 'Haber Akışı'

  return (
    <div className="min-h-screen bg-white -mt-[60px] pt-[60px]">
      <SeoManager
        title={item?.resolved_seo?.title || item?.seo_title || item?.title || null}
        description={item?.resolved_seo?.description || item?.seo_description || item?.excerpt || null}
        canonicalUrl={item?.resolved_seo?.canonical || item?.canonical_url || null}
        robots={item?.resolved_seo?.robots || item?.robots || null}
        ogTitle={item?.resolved_seo?.og_title || item?.og_title || null}
        ogDescription={item?.resolved_seo?.og_description || item?.og_description || null}
        ogImage={item?.resolved_seo?.og_image || item?.og_image || item?.featured_image || null}
        xTitle={item?.resolved_seo?.x_title || item?.x_title || null}
        xDescription={item?.resolved_seo?.x_description || item?.x_description || null}
        xHandle={item?.resolved_seo?.x_handle || item?.x_handle || null}
        siteName={item?.resolved_seo?.site_name || null}
        siteNamePosition={item?.resolved_seo?.site_name_position || null}
        siteNameSeparator={item?.resolved_seo?.site_name_separator || null}
        enabled={item?.resolved_seo?.enabled ?? true}
        structuredData={item?.structured_data || []}
      />
      <section className="relative overflow-hidden py-20 md:py-28 bg-[#0a1628] text-white border-b border-[#0f2746]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 z-10 grid lg:grid-cols-[1.08fr_0.92fr] gap-12 items-center">
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-[11px] uppercase tracking-[0.18em] font-semibold">{item.hero_badge || 'Kurumsal Haber'}</span>
              {item.category ? <span className="px-4 py-2 rounded-full bg-[#dd222c]/20 border border-[#dd222c]/25 text-[11px] uppercase tracking-[0.18em] font-semibold">{item.category}</span> : null}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[78px] font-black font-logo uppercase leading-[1.08] tracking-[0.01em] mb-7">{item.title}</h1>
            <p className="text-lg md:text-[21px] text-white/82 max-w-3xl leading-[1.85]">{item.excerpt}</p>
            <div className="mt-6 text-sm text-white/65">{item.source_label || 'LioXERP Haber Merkezi'} · {item.publish_date}</div>
          </div>

          <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(2,6,23,0.35)]">
            {item.featured_image ? <img src={item.featured_image} alt={item.featured_image_alt || item.title} className="w-full h-[460px] object-cover" /> : null}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_0.78fr] gap-10">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
            <StatamicRichContent blocks={item.content} className="space-y-5 text-gray-700 leading-relaxed" />
          </div>

          <div className="space-y-8">
            {item.summary_points && item.summary_points.length > 0 && (
              <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-8 shadow-sm">
                <h3 className="text-2xl font-black font-logo text-[#0a1628] mb-6 leading-[1.2]">Öne Çıkanlar</h3>
                <div className="space-y-3">
                  {item.summary_points.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#dd222c] shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.related_links && item.related_links.length > 0 && (
              <div className="rounded-[2rem] overflow-hidden border border-[#0f2746] bg-gradient-to-br from-[#07111f] via-[#0a1628] to-[#10203a] text-white p-8 md:p-10 shadow-2xl">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 font-semibold mb-3">{relatedSectionEyebrow}</div>
                <h3 className="text-3xl font-black font-logo mb-6 leading-[1.15] tracking-[0.01em]">{relatedSectionTitle}</h3>
                <div className="space-y-3">
                  {item.related_links.map((link, index) => (
                    <a key={index} href={link.url || '#'} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition">
                      <span>{link.label || 'Detayı Aç'}</span>
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/haber" className="inline-flex items-center gap-2 text-[#0a1628] font-bold hover:text-[#dd222c] transition">
            <i className="fa-solid fa-arrow-left text-xs" />
            Tüm Haberlere Dön
          </Link>
        </div>
      </section>
    </div>
  )
}
