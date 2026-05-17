import { useEffect, useState } from 'react'
import api, { unwrapApiData } from '@/services/api'

interface TestimonialItem {
  slug: string
  title: string
  company: string
  sector: string
  quote: string
  author?: string
  youtube_embed_url?: string
  logo_url?: string
  image_url?: string
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([])

  useEffect(() => {
    api.get<TestimonialItem[]>('/testimonials')
      .then((response) => setItems(unwrapApiData<TestimonialItem[]>(response.data, [])))
      .catch(() => setItems([]))
  }, [])

  return (
    <>
      <section className="bg-[#0a1628] text-white py-20 md:py-28 relative overflow-hidden border-b border-[#0f2746]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-[0_12px_30px_rgba(15,23,42,0.15)] text-[11px] uppercase tracking-[0.24em] font-semibold mb-7">
            Müşteri Referansları
          </div>

          <h1 className="hero-title-modern text-4xl md:text-6xl lg:text-[88px] font-black font-logo uppercase mb-6 text-white drop-shadow-[0_16px_40px_rgba(2,6,23,0.28)]">
            Başarı Hikayeleri
          </h1>

          <p className="text-lg md:text-[22px] leading-relaxed text-white/82 max-w-4xl mx-auto font-medium">
            LIOX ERP kullanan firmaların dönüşüm hikayelerini, sektör bazlı başarı örneklerini ve video referanslarını inceleyin.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {['Video Referanslar', 'Gerçek Müşteri Deneyimleri', 'Sektörel Başarılar'].map((item) => (
              <span key={item} className="px-4 py-2 rounded-full bg-white/8 border border-white/12 text-xs font-semibold tracking-[0.16em] uppercase text-white/80">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-gray-50/70">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {items.map((item) => (
            <div key={item.slug} className="grid lg:grid-cols-[1.1fr_0.9fr] rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition">
              <div className="p-8 md:p-10 space-y-5">
                <div className="flex items-center gap-4 flex-wrap">
                  {item.logo_url ? <img src={item.logo_url} alt={item.company} className="h-8 object-contain" /> : null}
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-500">{item.sector}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-secondary font-logo">{item.company}</h2>
                <p className="text-gray-700 text-lg leading-relaxed">“{item.quote}”</p>
                {item.author ? <div className="text-sm text-gray-500">{item.author}</div> : null}
              </div>
              <div className="bg-gray-50 min-h-[280px]">
                {item.youtube_embed_url ? (
                  <iframe
                    src={item.youtube_embed_url}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full min-h-[280px]"
                  />
                ) : item.image_url ? (
                  <img src={item.image_url} alt={item.company} className="w-full h-full object-cover min-h-[280px]" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
