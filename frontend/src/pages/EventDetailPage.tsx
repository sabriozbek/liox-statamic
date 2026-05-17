import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import api from '@/services/api'
import EventRegistrationForm from '@/components/forms/EventRegistrationForm'

interface EventSpeaker {
  name: string
  role?: string
  company?: string
  image?: string
  bio?: string
}

interface EventAgendaItem {
  time?: string
  title?: string
  description?: string
}

interface EventDetail {
  id: string
  slug: string
  title: string
  status: string
  event_type: string
  event_date: string
  event_time?: string
  event_end_date?: string
  location?: string
  registration_url?: string
  hero_badge?: string
  excerpt?: string
  featured_image?: string
  featured_image_alt?: string
  hero_points?: string[]
  content?: any[]
  agenda_title?: string
  agenda_items?: EventAgendaItem[]
  speakers_title?: string
  speakers?: EventSpeaker[]
  cta_title?: string
  cta_description?: string
  cta_button_text?: string
}

const TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar',
  summit: 'Zirve',
  workshop: 'Workshop',
  roundtable: 'Roundtable',
  onsite: 'Fiziksel Etkinlik',
}

export default function EventDetailPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    api.get<EventDetail>(`/events/${slug}`)
      .then((response) => setEvent(response.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">Etkinlik yükleniyor...</div>
  }

  if (!event) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">Etkinlik bulunamadı.</div>
  }

  return (
    <div className="min-h-screen bg-white -mt-[60px] pt-[60px]">
      <section className="relative overflow-hidden py-20 md:py-28 bg-[radial-gradient(circle_at_10%_18%,rgba(221,34,44,0.16),transparent_0,transparent_24%),radial-gradient(circle_at_82%_14%,rgba(255,255,255,0.08),transparent_0,transparent_22%),linear-gradient(180deg,#07111f_0%,#0a1628_48%,#10203a_100%)] text-white border-b border-[#0f2746]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-8 w-64 h-64 border border-white/5 rounded-full" />
          <div className="absolute bottom-10 right-8 w-80 h-80 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-10 right-[12%] h-24 w-24 rounded-[1.75rem] border border-white/10 bg-white/5 rotate-12" />
          <div className="absolute bottom-[8%] left-[12%] h-36 w-36 rounded-full border border-[#dd222c]/15 bg-[#dd222c]/10 blur-2xl" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 z-10 grid lg:grid-cols-[1.08fr_0.92fr] gap-12 items-center">
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-[11px] uppercase tracking-[0.18em] font-semibold">{event.hero_badge || 'Etkinlik'}</span>
              <span className="px-4 py-2 rounded-full bg-[#dd222c]/20 border border-[#dd222c]/25 text-[11px] uppercase tracking-[0.18em] font-semibold">{TYPE_LABELS[event.event_type] || event.event_type}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[78px] font-black font-logo uppercase leading-[1.08] tracking-[0.01em] mb-7">{event.title}</h1>
            <p className="text-lg md:text-[21px] text-white/82 max-w-3xl leading-[1.85]">{event.excerpt}</p>

            {event.hero_points && event.hero_points.length > 0 && (
              <div className="mt-10 grid sm:grid-cols-2 gap-3 max-w-3xl">
                {event.hero_points.map((point, index) => (
                  <div key={index} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm leading-6 text-white/85 backdrop-blur-sm">
                    <i className="fa-solid fa-check text-[#dd222c] mr-2" />
                    {point}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10">
              <a href="#event-registration-form" className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#dd222c] text-white text-sm font-black hover:bg-[#b81c29] transition shadow-lg">
                {event.cta_button_text || 'Etkinliğe Kaydol'}
                <i className="fa-solid fa-arrow-down text-xs" />
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(2,6,23,0.35)]">
            {event.featured_image ? <img src={event.featured_image} alt={event.featured_image_alt || event.title} className="w-full h-[460px] object-cover" /> : null}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold mb-2">Tarih</div>
            <div className="text-xl font-black text-[#0a1628]">{event.event_date}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold mb-2">Saat</div>
            <div className="text-xl font-black text-[#0a1628]">{event.event_time || 'Duyurulacak'}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold mb-2">Lokasyon</div>
            <div className="text-xl font-black text-[#0a1628]">{event.location || 'Online'}</div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_0.82fr] gap-10">
          <div className="space-y-10">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-black font-logo text-[#0a1628] mb-6 leading-[1.2] tracking-[0.01em]">Etkinlik Hakkında</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {event.content?.map((block, index) => (
                  <div key={index}>
                    {block.type === 'heading' ? <h3 className="text-xl font-black text-[#0a1628] leading-[1.35] tracking-[0.01em] mb-3">{block.text}</h3> : null}
                    {block.type === 'paragraph' ? <p>{block.text}</p> : null}
                  </div>
                ))}
              </div>
            </div>

            {event.agenda_items && event.agenda_items.length > 0 && (
              <div className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-black font-logo text-[#0a1628] mb-6 leading-[1.2] tracking-[0.01em]">{event.agenda_title || 'Program Akışı'}</h2>
                <div className="space-y-4">
                  {event.agenda_items.map((item, index) => (
                    <div key={index} className="grid md:grid-cols-[120px_1fr] gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                      <div className="text-[#dd222c] font-black text-lg">{item.time}</div>
                      <div>
                        <h3 className="font-black text-[#0a1628] text-lg mb-2 leading-[1.35]">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {event.speakers && event.speakers.length > 0 && (
              <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-black font-logo text-[#0a1628] mb-6 leading-[1.2] tracking-[0.01em]">{event.speakers_title || 'Konuşmacılar'}</h2>
                <div className="space-y-5">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex gap-4 items-start rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      {speaker.image ? <img src={speaker.image} alt={speaker.name} className="w-16 h-16 rounded-2xl object-cover" /> : <div className="w-16 h-16 rounded-2xl bg-[#0a1628]/10" />}
                      <div>
                        <h3 className="font-black text-[#0a1628]">{speaker.name}</h3>
                        <div className="text-sm text-[#dd222c] font-semibold">{speaker.role}{speaker.company ? ` · ${speaker.company}` : ''}</div>
                        {speaker.bio ? <p className="text-sm text-gray-600 mt-2 leading-relaxed">{speaker.bio}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[2rem] overflow-hidden border border-[#0f2746] bg-gradient-to-br from-[#07111f] via-[#0a1628] to-[#10203a] text-white p-8 md:p-10 shadow-2xl">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 font-semibold mb-3">Kayıt ve Katılım</div>
              <h2 className="text-3xl font-black font-logo mb-4 leading-[1.15] tracking-[0.01em]">{event.cta_title || 'Yerini Ayır'}</h2>
              <p className="text-white/75 leading-relaxed mb-8">{event.cta_description || 'Etkinliğe katılmak için şimdi kaydını oluştur ve program detaylarını e-posta ile al.'}</p>
              <a href="#event-registration-form" className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#dd222c] text-white text-sm font-black hover:bg-[#b81c29] transition">
                {event.cta_button_text || 'Hemen Kaydol'}
                <i className="fa-solid fa-arrow-down text-xs" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="event-registration-form" className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.82fr_1.18fr] gap-8 items-start">
          <div className="rounded-[2rem] overflow-hidden border border-[#0f2746] bg-gradient-to-br from-[#07111f] via-[#0a1628] to-[#10203a] text-white p-8 md:p-10 shadow-2xl sticky top-24">
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 font-semibold mb-3">Etkinlik Kaydı</div>
            <h2 className="text-3xl md:text-4xl font-black font-logo mb-4 leading-[1.15] tracking-[0.01em]">{event.cta_title || 'Katılım Talebinizi Oluşturun'}</h2>
            <p className="text-white/75 leading-relaxed mb-6">{event.cta_description || 'Formu doldurarak etkinliğe katılım talebinizi iletebilir, program ve erişim bilgilerini alabilirsiniz.'}</p>
            <div className="space-y-3 text-sm text-white/80">
              <div><i className="fa-solid fa-calendar-days text-[#dd222c] mr-2" />{event.event_date}</div>
              <div><i className="fa-solid fa-clock text-[#dd222c] mr-2" />{event.event_time || 'Saat duyurulacak'}</div>
              <div><i className="fa-solid fa-location-dot text-[#dd222c] mr-2" />{event.location || 'Online'}</div>
            </div>
          </div>

          <EventRegistrationForm eventSlug={event.slug} eventTitle={event.title} />
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/etkinlik" className="inline-flex items-center gap-2 text-[#0a1628] font-bold hover:text-[#dd222c] transition">
            <i className="fa-solid fa-arrow-left text-xs" />
            Tüm Etkinliklere Dön
          </Link>
        </div>
      </section>
    </div>
  )
}
