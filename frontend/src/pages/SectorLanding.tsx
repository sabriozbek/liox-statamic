import { Link, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import NotFoundPage from '@/pages/NotFoundPage'
import LeadForm from '@/components/forms/LeadForm'
import api from '@/services/api'

interface IndustryStat {
  icon: string
  value: string
  label: string
  description: string
}

interface Metric {
  label: string
  value: string
  suffix?: string
  prefix?: string
}

interface Benefit {
  title: string
  description: string
  icon: string
}

interface ProcessStep {
  step_number: string
  title: string
  description: string
  icon: string
}

interface FAQ {
  question: string
  answer: string
}

interface RelatedModule {
  id: string
  title: string
  slug: string
}

interface CustomerLogo {
  name: string
  logo: string
}

interface SectorData {
  slug: string
  title: string
  description: string
  hero_badge?: string
  hero_visual?: string
  hero_points?: string[]
  content?: Array<{ type?: string; text?: string }>
  industry_stats_title?: string
  industry_stats?: IndustryStat[]
  metrics: Metric[]
  benefits: Benefit[]
  process_title?: string
  process_subtitle?: string
  process_steps?: ProcessStep[]
  split_title?: string
  split_description?: string
  split_image?: string
  split_items?: string[]
  success_title?: string
  success_quote?: string
  success_author?: string
  success_company?: string
  success_author_role?: string
  success_image?: string
  success_quote_icon?: string
  youtube_embed_url?: string
  faq_title?: string
  faqs?: FAQ[]
  customer_logos?: CustomerLogo[]
  bottom_cta_title?: string
  bottom_cta_description?: string
  bottom_form_title?: string
  bottom_form_description?: string
  bottom_form_image?: string
  extra_section_title?: string
  extra_section_description?: string
  extra_section_image?: string
  extra_section_items?: string[]
  related_modules_title?: string
  related_modules?: RelatedModule[]
  seo_title?: string
  seo_description?: string
}

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const hasNonNumeric = value !== String(numericValue)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [numericValue])

  return (
    <span>
      {hasNonNumeric ? value : count}
      {suffix}
    </span>
  )
}

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-5 flex items-center justify-between text-left">
            <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
            <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#0a1628]/5 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              <i className="fa-solid fa-chevron-down text-[#0a1628] text-sm" />
            </span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProcessTimeline({ steps, title, subtitle }: { steps: ProcessStep[]; title?: string; subtitle?: string }) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 mb-4">{title}</h2>
            {subtitle && <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#0a1628]/10 via-[#0a1628]/30 to-[#0a1628]/10 transform -translate-y-1/2" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-6 mx-auto lg:mx-0 shadow-lg">
                    {step.step_number}
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="w-12 h-12 bg-[#0a1628]/10 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0">
                      <i className={`fa-solid ${step.icon} text-[#0a1628] text-xl`} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 font-logo">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SuccessStoryCard({ quote, author, company, role, image, youtubeUrl }: { quote?: string; author?: string; company?: string; role?: string; image?: string; youtubeUrl?: string }) {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
      <div className="grid lg:grid-cols-[1.2fr_1fr] h-full">
        <div className="p-10 lg:p-14 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <i className="fa-solid fa-quote-left text-white text-4xl" />
          </div>
          <blockquote className="text-2xl lg:text-3xl font-black text-gray-900 leading-snug mb-8 font-logo">"{quote}"</blockquote>
          <div className="flex items-center gap-5 mt-auto pt-8 border-t border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
              {author?.charAt(0) || 'K'}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">{author}</div>
              <div className="text-gray-500">{role}</div>
              <div className="text-[#dd222c] font-semibold">{company}</div>
            </div>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-[#0a1628] to-[#061018] flex items-center justify-center min-h-[400px] overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-full animate-float" />
          <div className="absolute bottom-20 left-10 w-20 h-20 bg-[#dd222c]/20 rounded-full animate-float-reverse" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow" />
          {youtubeUrl ? (
            showVideo ? (
              <div className="absolute inset-0 z-10">
                <iframe src={youtubeUrl} title={`${company} başarı hikayesi`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full" />
                <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition shadow-lg z-20">
                  <i className="fa-solid fa-times" />
                </button>
              </div>
            ) : (
              <div className="text-center p-8 relative z-10">
                <button onClick={() => setShowVideo(true)} className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform group">
                  <i className="fa-solid fa-play text-[#dd222c] text-3xl ml-1 group-hover:text-[#b81c29]" />
                </button>
                <div className="text-white">
                  <div className="text-lg font-bold mb-2">{company}</div>
                  <div className="text-white/70 text-sm">Başarı Hikayesini İzleyin</div>
                </div>
              </div>
            )
          ) : image ? (
            <img src={image} alt={company} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <i className="fa-solid fa-play-circle text-white/20 text-6xl mb-4" />
              <div className="text-white/50">Video yakında eklenecek</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BottomFormSection({ title, description, sectorTitle }: { title?: string; description?: string; sectorTitle?: string }) {
  return (
    <section className="py-24 bg-[#0a1628] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 border border-white/5 rounded-full" />
        <div className="absolute -top-10 -right-10 w-72 h-72 border border-white/10 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-[#dd222c] rounded-full opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-white rounded-full opacity-10" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <i className="fa-solid fa-rocket text-[#dd222c]" />
              Hemen Başlayın
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-logo mb-6 leading-tight">{title || 'Sektörünüz İçin Demo Talep Edin'}</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">{description || 'Uzmana danışın, sektörünüze özel ERP çözümünü keşfedin.'}</p>
            <div className="space-y-4">
              {['Sektöre özel analiz ve öneriler', 'Ücretsiz demo ve fiyat teklifi', '7/24 teknik destek garantisi'].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#dd222c] rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-check text-white text-sm" />
                  </div>
                  <span className="text-white/90 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-bold mb-4">
                <i className="fa-solid fa-bolt" />
                Ücretsiz Demo
              </div>
              <h3 className="text-2xl font-black text-gray-900 font-logo">{sectorTitle ? `${sectorTitle} İçin` : ''} Bilgi Alın</h3>
              <p className="text-gray-500 text-sm mt-2">Formu doldurun, size ulaşalım</p>
            </div>
            <LeadForm variantId={4} showTitle={false} className="[&_input]:border-gray-200 [&_input]:focus:border-[#0a1628] [&_button]:bg-[#0a1628] [&_button]:hover:bg-[#dd222c] [&_button]:text-white [&_button]:font-bold" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SectorLanding() {
  const { slug } = useParams()
  const [sector, setSector] = useState<SectorData | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get<SectorData>(`/sectors/${slug}`)
      .then((response) => {
        setSector(response.data)
        setNotFound(false)
      })
      .catch((error) => {
        setSector(null)
        setNotFound(String(error?.response?.status || error?.message || '') === '404')
      })
  }, [slug])

  if (notFound) return <NotFoundPage />
  if (!sector) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1628]"></div></div>

  return (
    <>
      <section className="bg-[#0a1628] text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm mb-6 uppercase tracking-[0.15em] font-semibold">
              <i className="fa-solid fa-star text-[#dd222c]" />
              {sector.hero_badge || 'Sektör Çözümü'}
            </div>
            <h1 className="text-4xl lg:text-6xl font-black font-logo mb-6 uppercase leading-tight">{sector.title}</h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl leading-relaxed">{sector.description}</p>
            {!!sector.hero_points?.length && (
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/90 mb-10 max-w-3xl">
                {sector.hero_points.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                    <i className="fa-solid fa-check-circle text-[#dd222c]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4">
              <a href="#form" className="inline-flex items-center px-8 py-4 rounded-2xl bg-white text-[#0a1628] font-black hover:bg-gray-100 transition shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <i className="fa-solid fa-arrow-right mr-2" />
                Bilgi Alın
              </a>
              <a href="#benefits" className="inline-flex items-center px-8 py-4 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition border border-white/20 backdrop-blur-sm">
                <i className="fa-solid fa-play mr-2" />
                Detaylı Bilgi
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-white/10 min-h-[400px] relative">
            {sector.hero_visual ? (
              <img src={sector.hero_visual} alt={sector.title} className="w-full h-full object-cover min-h-[400px]" />
            ) : (
              <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-[#0a1628]/20 to-[#0f2744]/20 flex items-center justify-center">
                <i className="fa-solid fa-industry text-white/20 text-8xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {!!sector.industry_stats?.length && (
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            {sector.industry_stats_title && <h2 className="text-2xl font-black font-logo text-gray-900 text-center mb-12 uppercase">{sector.industry_stats_title}</h2>}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sector.industry_stats.map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group">
                  <div className="w-16 h-16 bg-[#0a1628]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0a1628]/10 transition-colors">
                    <i className={`fa-solid ${stat.icon} text-[#0a1628] text-2xl`} />
                  </div>
                  <div className="text-4xl font-black text-[#0a1628] mb-2 font-logo"><AnimatedCounter value={stat.value} /></div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!sector.process_steps?.length && <ProcessTimeline steps={sector.process_steps} title={sector.process_title} subtitle={sector.process_subtitle} />}

      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {sector.metrics.map((metric, i) => (
              <div key={i} className="text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10 hover:shadow-lg transition">
                <div className="text-5xl lg:text-6xl font-black text-[#0a1628] mb-3 font-logo"><AnimatedCounter value={metric.value} suffix={metric.suffix} />{metric.prefix}</div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-rocket" />
              Faydalar
            </div>
            <h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 uppercase">Size Özel Faydalar</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sector.benefits.map((benefit, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0a1628]/5 to-transparent rounded-bl-full" />
                <div className="w-14 h-14 bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${benefit.icon} text-white text-xl`} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 font-logo">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!!sector.split_title && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-[2rem] overflow-hidden border border-gray-200 shadow-lg bg-white order-2 lg:order-1">
              {sector.split_image ? (
                <img src={sector.split_image} alt={sector.split_title} className="w-full h-full object-cover min-h-[400px]" />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-[#0a1628] to-[#0f2744] flex items-center justify-center">
                  <i className="fa-solid fa-image text-white/20 text-6xl" />
                </div>
              )}
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 mb-6 leading-tight">{sector.split_title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{sector.split_description}</p>
              </div>
              {!!sector.split_items?.length && (
                <div className="space-y-4">
                  {sector.split_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
                      <div className="w-8 h-8 bg-[#0a1628] rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-white text-sm" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!!sector.success_quote && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 space-y-16">
            {sector.success_title && <div className="text-center"><h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 uppercase">{sector.success_title}</h2></div>}
            <SuccessStoryCard quote={sector.success_quote} author={sector.success_author} company={sector.success_company} role={sector.success_author_role} image={sector.success_image} youtubeUrl={sector.youtube_embed_url} />
            {sector.customer_logos?.length ? (
              <div className="rounded-[2rem] border border-gray-200 bg-white shadow-sm px-8 py-8">
                <div className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 mb-6">Referanslarımız</div>
                <div className="flex flex-wrap items-center justify-center gap-12">
                  {sector.customer_logos.map((logo, index) => (
                    <div key={index} className="h-12 flex items-center grayscale hover:grayscale-0 transition-all duration-300">
                      <img src={logo.logo} alt={logo.name} className="h-10 object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {!!sector.related_modules?.length && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#dd222c]/5 text-[#dd222c] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="fa-solid fa-puzzle-piece" />
                Entegre Modüller
              </div>
              <h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 uppercase">{sector.related_modules_title || 'İlgili Modüller'}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sector.related_modules.map((module, index) => (
                <Link key={index} to={`/moduller/${module.slug}`} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-cube text-white text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-[#0a1628] transition-colors">{module.title}</div>
                    <div className="text-sm text-gray-500">Modül Detayı</div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-gray-300 ml-auto group-hover:text-[#0a1628] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!sector.faqs?.length && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="fa-solid fa-circle-question" />
                SSS
              </div>
              <h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 uppercase">{sector.faq_title || 'Sıkça Sorulan Sorular'}</h2>
            </div>
            <FAQAccordion faqs={sector.faqs} />
          </div>
        </section>
      )}

      {!!sector.extra_section_title && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-black font-logo text-gray-900 leading-tight">{sector.extra_section_title}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{sector.extra_section_description}</p>
              {!!sector.extra_section_items?.length && (
                <div className="space-y-4">
                  {sector.extra_section_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-[#dd222c] rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-check text-white text-sm" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-[2rem] overflow-hidden border border-gray-200 shadow-lg bg-white">
              {sector.extra_section_image ? (
                <img src={sector.extra_section_image} alt={sector.extra_section_title} className="w-full h-full object-cover min-h-[350px]" />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-[#0a1628] to-[#0f2744] flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-white/20 text-6xl" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!!sector.content?.length && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 space-y-6">
            {sector.content.map((block, index) => (
              <div key={index} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm text-gray-700 leading-relaxed text-base">{block.text}</div>
            ))}
          </div>
        </section>
      )}

      <div id="form">
        <BottomFormSection title={sector.bottom_form_title || sector.bottom_cta_title || 'Sektörünüz İçin Demo Talep Edin'} description={sector.bottom_form_description || sector.bottom_cta_description || 'Uzman ekibimiz sektörünüze özel çözümler sunmak için hazır.'} sectorTitle={sector.title} />
      </div>

      {sector.seo_title && (<><title>{sector.seo_title}</title><meta name="description" content={sector.seo_description} /></>)}
    </>
  )
}
