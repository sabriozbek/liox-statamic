import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import api, { unwrapApiData } from '@/services/api'

interface EventListItem {
  id: string
  slug: string
  title: string
  status: 'upcoming' | 'live' | 'past'
  event_type: 'webinar' | 'summit' | 'workshop' | 'roundtable' | 'onsite'
  event_date: string
  event_time?: string
  location?: string
  hero_badge?: string
  excerpt?: string
  registration_url?: string
  featured_image?: string
  featured_image_alt?: string
  hero_points?: string[]
}

const STATUS_LABELS: Record<string, string> = {
  upcoming: 'Yaklaşan Etkinlik',
  live: 'Canlı',
  past: 'Geçmiş Etkinlik',
}

const TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar',
  summit: 'Zirve',
  workshop: 'Workshop',
  roundtable: 'Roundtable',
  onsite: 'Fiziksel Etkinlik',
}

const STATUS_CLASSES: Record<string, string> = {
  upcoming: 'bg-white/10 border-white/20 text-white/90',
  live: 'bg-[#dd222c]/20 border-[#dd222c]/30 text-white',
  past: 'bg-white/5 border-white/10 text-white/70',
}

export default function EventsPage() {
  const [items, setItems] = useState<EventListItem[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'live' | 'past'>('all')

  useEffect(() => {
    api.get<EventListItem[]>('/events')
      .then((response) => setItems(unwrapApiData<EventListItem[]>(response.data, [])))
      .catch(() => setItems([]))
  }, [])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items
    return items.filter((item) => item.status === activeFilter)
  }, [items, activeFilter])

  const featuredEvent = filteredItems[0]

  return (
    <>
      <section className="relative overflow-hidden py-24 md:py-32 border-b border-[#0f2746] bg-[#0a1628] text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-[0_12px_30px_rgba(15,23,42,0.15)] text-[11px] uppercase tracking-[0.24em] font-semibold mb-7">
              Etkinlikler & Webinarlar
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[82px] font-black font-logo uppercase mb-6 leading-[1.08] tracking-[0.01em] text-white drop-shadow-[0_16px_40px_rgba(2,6,23,0.28)]">
              LioXERP
              <br />
              Etkinlikleri
            </h1>

            <p className="text-lg md:text-[22px] leading-[1.85] text-white/82 max-w-3xl font-medium">
              Sektörel webinarlar, canlı etkinlikler, dönüşüm zirveleri ve ürün odaklı özel oturumlarla LioXERP ekibiyle buluşun.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'upcoming', label: 'Yaklaşanlar' },
              { key: 'live', label: 'Canlı' },
              { key: 'past', label: 'Geçmiş' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-[0.16em] uppercase transition ${activeFilter === filter.key ? 'bg-white text-[#0a1628] border-white' : 'bg-white/8 border-white/12 text-white/80 hover:bg-white/14'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {featuredEvent && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] rounded-[2rem] overflow-hidden border border-gray-200 shadow-xl bg-white">
              <div className="relative min-h-[420px] bg-[#0a1628]">
                {featuredEvent.featured_image ? (
                  <img src={featuredEvent.featured_image} alt={featuredEvent.featured_image_alt || featuredEvent.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-br from-[#07111f]/88 via-[#0a1628]/72 to-[#10203a]/78" />
                <div className="relative z-10 p-8 md:p-10 lg:p-12 text-white h-full flex flex-col justify-end">
                  <div className="flex flex-wrap gap-3 mb-5">
                    <span className={`px-4 py-2 rounded-full border text-[11px] uppercase tracking-[0.2em] font-semibold ${STATUS_CLASSES[featuredEvent.status] || STATUS_CLASSES.upcoming}`}>
                      {STATUS_LABELS[featuredEvent.status] || 'Etkinlik'}
                    </span>
                    <span className="px-4 py-2 rounded-full border border-white/15 bg-white/10 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/90">
                      {TYPE_LABELS[featuredEvent.event_type] || featuredEvent.event_type}
                    </span>
                  </div>
                    <h2 className="text-3xl md:text-5xl font-black font-logo leading-[1.12] tracking-[0.01em] mb-4">{featuredEvent.title}</h2>
                  <p className="text-white/80 text-base md:text-lg max-w-2xl">{featuredEvent.excerpt}</p>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-white flex flex-col justify-between gap-8">
                <div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2">Tarih</div>
                      <div className="text-lg font-black text-[#0a1628]">{featuredEvent.event_date}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2">Saat</div>
                      <div className="text-lg font-black text-[#0a1628]">{featuredEvent.event_time || 'Duyurulacak'}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2">Lokasyon</div>
                    <div className="text-base font-semibold text-[#0a1628]">{featuredEvent.location || 'Online'}</div>
                  </div>

                  {featuredEvent.hero_points && featuredEvent.hero_points.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {featuredEvent.hero_points.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[#dd222c] shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to={`/etkinlik/${featuredEvent.slug}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a1628] text-white text-sm font-black hover:bg-[#dd222c] transition">
                    Etkinlik Detayını İncele
                    <i className="fa-solid fa-arrow-right text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-gray-50/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link key={item.slug} to={`/etkinlik/${item.slug}`} className="group rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0f2744]">
                  {item.featured_image ? <img src={item.featured_image} alt={item.featured_image_alt || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/30 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className={`px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.18em] font-semibold ${STATUS_CLASSES[item.status] || STATUS_CLASSES.upcoming}`}>
                      {STATUS_LABELS[item.status] || 'Etkinlik'}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-6 right-6 text-white">
                    <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-white/75 mb-2">{TYPE_LABELS[item.event_type] || item.event_type}</div>
                    <h2 className="text-2xl font-black font-logo leading-[1.15] tracking-[0.01em]">{item.title}</h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                    <span>{item.event_date}</span>
                    <span>{item.event_time || 'Saat duyurulacak'}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{item.excerpt}</p>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-700">
                    <i className="fa-solid fa-location-dot text-[#dd222c] mr-2" />
                    {item.location || 'Online'}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#dd222c] group-hover:text-[#b81c29] transition-colors">Detaya Git</span>
                    <i className="fa-solid fa-arrow-right text-[#dd222c] text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
