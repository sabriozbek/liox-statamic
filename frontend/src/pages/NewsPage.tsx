import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { unwrapApiData } from '@/services/api'
import SeoManager from '@/components/seo/SeoManager'

interface NewsItem {
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
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([])

  useEffect(() => {
    api.get<NewsItem[]>('/news')
      .then((response) => setItems(unwrapApiData<NewsItem[]>(response.data, [])))
      .catch(() => setItems([]))
  }, [])

  const featured = items[0]

  return (
    <>
      <SeoManager
        title="LioXERP Haberler"
        description="Ürün güncellemeleri, kurumsal duyurular, iş ortaklığı gelişmeleri ve ekosistem haberlerini LioXERP Haber Merkezi'nden takip edin."
      />

      <section className="relative overflow-hidden py-24 md:py-32 bg-[#0a1628] text-white border-b border-[#0f2746]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] uppercase tracking-[0.24em] font-semibold mb-7">
            Haber Merkezi
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-[82px] font-black font-logo uppercase mb-6 leading-[1.08] tracking-[0.01em] text-white">
            LioXERP
            <br />
            Haberler
          </h1>
          <p className="text-lg md:text-[22px] leading-[1.85] text-white/82 max-w-3xl font-medium">
            Ürün güncellemeleri, kurumsal duyurular, iş ortaklığı gelişmeleri ve ekosistem haberleri tek merkezde.
          </p>
        </div>
      </section>

      {featured && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <Link to={`/haber/${featured.slug}`} className="grid lg:grid-cols-[1.1fr_0.9fr] rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-xl group">
              <div className="relative min-h-[420px] bg-[#0a1628]">
                {featured.featured_image ? <img src={featured.featured_image} alt={featured.featured_image_alt || featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : null}
                <div className="absolute inset-0 bg-gradient-to-br from-[#07111f]/88 via-[#0a1628]/72 to-[#10203a]/78" />
                <div className="relative z-10 p-8 md:p-10 lg:p-12 text-white h-full flex flex-col justify-end">
                  <div className="flex flex-wrap gap-3 mb-5">
                    <span className="px-4 py-2 rounded-full border border-white/15 bg-white/10 text-[11px] uppercase tracking-[0.2em] font-semibold">{featured.hero_badge || 'Kurumsal Haber'}</span>
                    {featured.category ? <span className="px-4 py-2 rounded-full border border-[#dd222c]/25 bg-[#dd222c]/20 text-[11px] uppercase tracking-[0.2em] font-semibold">{featured.category}</span> : null}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black font-logo leading-[1.12] tracking-[0.01em] mb-4">{featured.title}</h2>
                  <p className="text-white/80 text-base md:text-lg max-w-2xl">{featured.excerpt}</p>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-3">{featured.source_label || 'LioXERP Haber Merkezi'}</div>
                  <div className="text-lg font-black text-[#0a1628] mb-4">{featured.publish_date}</div>
                  <div className="space-y-3">
                    {(featured.summary_points || []).map((point, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#dd222c] shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-[#dd222c] font-bold">
                  Haberi Oku
                  <i className="fa-solid fa-arrow-right text-xs" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-gray-50/70">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.slice(1).map((item) => (
            <Link key={item.slug} to={`/haber/${item.slug}`} className="group rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0f2744]">
                {item.featured_image ? <img src={item.featured_image} alt={item.featured_image_alt || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/30 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/75 mb-2">{item.category || 'Haber'}</div>
                  <h2 className="text-2xl font-black font-logo leading-[1.15] tracking-[0.01em]">{item.title}</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm text-gray-500">{item.publish_date}</div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-[#dd222c] font-bold">
                  Detay
                  <i className="fa-solid fa-arrow-right text-xs" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
