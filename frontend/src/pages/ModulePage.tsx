import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import api from '@/services/api'
import LeadForm from '@/components/forms/LeadForm'
import NotFoundPage from '@/pages/NotFoundPage'
import StatamicRichContent from '@/components/content/StatamicRichContent'
import SeoManager from '@/components/seo/SeoManager'

interface ModuleData {
  slug: string
  title: string
  short_description: string
  icon?: string
  hero_badge?: string
  hero_highlights?: string[]
  hero_stats?: Array<{ value: string; label: string }>
  hero_visual_url?: string
  extra_section_title?: string
  extra_section_description?: string
  extra_section_image_url?: string
  extra_section_reverse?: boolean
  extra_section_items?: string[]
  pain_points_title?: string
  pain_points?: Array<{ title: string; description: string; icon?: string }>
  capabilities_title?: string
  capabilities?: Array<{ title: string; description: string; image_url?: string }>
  split_title?: string
  split_description?: string
  split_image_url?: string
  split_items?: string[]
  customer_logos?: Array<{ name: string; logo_url: string }>
  testimonial_quote?: string
  testimonial_author?: string
  testimonial_company?: string
  testimonial_image_url?: string
  bottom_cta_title?: string
  bottom_cta_description?: string
  features: Array<{ title: string; description: string }>
  content?: Array<{ type?: string; text?: string }>
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

export default function ModulePage() {
  const { slug } = useParams()
  const [moduleData, setModuleData] = useState<ModuleData | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get<ModuleData>(`/modules/${slug}`)
      .then((response) => {
        setModuleData(response.data)
        setNotFound(false)
      })
      .catch((error) => {
        setModuleData(null)
        setNotFound(error?.response?.status === 404)
      })
  }, [slug])

  if (notFound) return <NotFoundPage />
  if (!moduleData) return <section className="py-24 text-center text-gray-500">Modül yükleniyor...</section>

  return (
    <>
      <SeoManager
        title={moduleData?.resolved_seo?.title || moduleData?.seo_title || moduleData?.title || null}
        description={moduleData?.resolved_seo?.description || moduleData?.seo_description || moduleData?.short_description || null}
        canonicalUrl={moduleData?.resolved_seo?.canonical || moduleData?.canonical_url || null}
        robots={moduleData?.resolved_seo?.robots || moduleData?.robots || null}
        ogTitle={moduleData?.resolved_seo?.og_title || moduleData?.og_title || null}
        ogDescription={moduleData?.resolved_seo?.og_description || moduleData?.og_description || null}
        ogImage={moduleData?.resolved_seo?.og_image || moduleData?.og_image || null}
        xTitle={moduleData?.resolved_seo?.x_title || moduleData?.x_title || null}
        xDescription={moduleData?.resolved_seo?.x_description || moduleData?.x_description || null}
        xHandle={moduleData?.resolved_seo?.x_handle || moduleData?.x_handle || null}
        siteName={moduleData?.resolved_seo?.site_name || null}
        siteNamePosition={moduleData?.resolved_seo?.site_name_position || null}
        siteNameSeparator={moduleData?.resolved_seo?.site_name_separator || null}
        enabled={moduleData?.resolved_seo?.enabled ?? true}
        structuredData={moduleData?.structured_data || []}
      />

      <section className="bg-[#0a1628] text-white py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm uppercase tracking-[0.15em] font-semibold">
              <i className="fa-solid fa-star text-[#dd222c]" />
              {moduleData.hero_badge || 'Modül Çözümü'}
            </div>
            <h1 className="text-4xl lg:text-6xl font-black font-logo leading-tight">
              {moduleData.title}
            </h1>
            <p className="text-lg text-white/80 max-w-3xl">{moduleData.short_description}</p>
            {!!moduleData.hero_highlights?.length && (
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/90 mb-6">
                {moduleData.hero_highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <i className="fa-solid fa-check-circle text-[#dd222c]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-white/10 min-h-[380px] relative">
              {moduleData.hero_visual_url ? (
                <img src={moduleData.hero_visual_url} alt={moduleData.title} className="w-full h-full object-cover min-h-[380px]" />
              ) : (
                <div className="w-full h-full min-h-[380px] bg-gradient-to-br from-[#0a1628]/20 to-[#0f2744]/20 flex items-center justify-center">
                  <i className="fa-solid fa-cube text-white/20 text-8xl" />
                </div>
              )}
            </div>
            {!!moduleData.hero_stats?.length && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {moduleData.hero_stats.map((stat, index) => (
                  <div key={index} className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-4 text-center">
                    <div className="text-2xl font-black text-[#dd222c]">{stat.value}</div>
                    <div className="text-[11px] text-white/70 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:sticky lg:top-28 min-w-0">
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <i className="fa-solid fa-bolt" />
                  Ücretsiz Demo
                </div>
                <h3 className="text-2xl font-black text-gray-900 font-logo">{moduleData.title} İçin</h3>
                <p className="text-gray-500 text-sm mt-2">Formu doldurun, size ulaşalım</p>
              </div>
              <LeadForm variantId={1} showTitle={false} className="[&_input]:border-gray-200 [&_input]:focus:border-[#0a1628] [&_button]:bg-[#0a1628] [&_button]:hover:bg-[#dd222c] [&_button]:text-white [&_button]:font-bold" />
            </div>
          </div>
        </div>
      </section>

      {!!moduleData.pain_points?.length && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black font-logo text-center text-gray-900 mb-10">
              {moduleData.pain_points_title || 'Bunlar size tanıdık geliyor mu?'}
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {moduleData.pain_points.map((item, index) => (
                <div key={index} className="rounded-3xl border border-red-100 bg-red-50/40 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-red-100 text-[#dd222c] flex items-center justify-center mb-4">
                    <i className={item.icon || 'fa-solid fa-circle-exclamation'} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 font-logo">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!moduleData.content?.length && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
              <StatamicRichContent blocks={moduleData.content} className="space-y-5" />
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black font-logo text-gray-900 text-center mb-12 uppercase">{moduleData.capabilities_title || 'Öne Çıkan Özellikler'}</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(moduleData.capabilities?.length ? moduleData.capabilities : moduleData.features).map((feature: any, index) => (
              <div key={index} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 mb-4 min-h-[140px] flex items-center justify-center">
                  {feature.image_url ? <img src={feature.image_url} alt={feature.title} className="w-full h-40 object-cover" /> : <i className="fa-solid fa-image text-gray-300 text-2xl" />}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 font-logo">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!!moduleData.split_title && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-[2rem] overflow-hidden border border-gray-200 shadow-lg bg-white">
              {moduleData.split_image_url ? (
                <img src={moduleData.split_image_url} alt={moduleData.split_title} className="w-full h-full object-cover min-h-[320px]" />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-[#0a1628] to-[#0f2744] flex items-center justify-center">
                  <i className="fa-solid fa-image text-white/20 text-6xl" />
                </div>
              )}
            </div>
            <div className="space-y-5">
              <h2 className="text-3xl font-black font-logo text-gray-900">{moduleData.split_title}</h2>
              <p className="text-gray-600 leading-relaxed">{moduleData.split_description}</p>
              {!!moduleData.split_items?.length && (
                <div className="space-y-3">
                  {moduleData.split_items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-[#0a1628] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-white text-xs" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!!moduleData.extra_section_title && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className={`max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center ${moduleData.extra_section_reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
            <div className="rounded-[2rem] overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
              {moduleData.extra_section_image_url ? (
                <img src={moduleData.extra_section_image_url} alt={moduleData.extra_section_title} className="w-full h-full object-cover min-h-[320px]" />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-[#0a1628] to-[#0f2744] flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-white/20 text-6xl" />
                </div>
              )}
            </div>
            <div className="space-y-5">
              <h2 className="text-3xl font-black font-logo text-gray-900">{moduleData.extra_section_title}</h2>
              <p className="text-gray-600 leading-relaxed">{moduleData.extra_section_description}</p>
              {!!moduleData.extra_section_items?.length && (
                <div className="space-y-3">
                  {moduleData.extra_section_items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-[#dd222c] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-white text-xs" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!!moduleData.customer_logos?.length && (
        <section className="py-14 bg-gray-50 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {moduleData.customer_logos.map((logo, index) => (
                <div key={index} className="h-10 flex items-center grayscale hover:grayscale-0 transition-all duration-300">
                  <img src={logo.logo_url} alt={logo.name} className="h-8 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!moduleData.testimonial_quote && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] rounded-[2rem] overflow-hidden border border-gray-200 shadow-lg bg-white">
              <div className="p-8 md:p-10 space-y-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-quote-left text-white text-3xl" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">"{moduleData.testimonial_quote}"</p>
                <div>
                  <div className="font-black text-gray-900">{moduleData.testimonial_author}</div>
                  <div className="text-sm text-gray-500">{moduleData.testimonial_company}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0a1628] to-[#061018] min-h-[260px] relative overflow-hidden">
                <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full animate-float" />
                <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#dd222c]/20 rounded-full animate-float-reverse" />
                {moduleData.testimonial_image_url ? (
                  <img src={moduleData.testimonial_image_url} alt={moduleData.testimonial_author || moduleData.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fa-solid fa-user text-white/20 text-6xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {!!moduleData.content?.length && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 space-y-6">
            {moduleData.content.map((block, index) => (
              <div key={index} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm text-gray-700 leading-relaxed text-base">
                {block.text}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="form" className="py-24 bg-[#0a1628] text-white relative overflow-hidden">
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
              <h2 className="text-3xl lg:text-5xl font-black font-logo mb-6 leading-tight">
                {moduleData.bottom_cta_title || `${moduleData.title} Modülünü Keşfedin`}
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                {moduleData.bottom_cta_description || 'İşletmenize uygun modül kurgusu için bizimle iletişime geçin.'}
              </p>
              <div className="space-y-4">
                {['Modüle özel analiz ve öneriler', 'Ücretsiz demo ve fiyat teklifi', '7/24 teknik destek garantisi'].map((item, i) => (
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
                <h3 className="text-2xl font-black text-gray-900 font-logo">{moduleData.title} İçin Bilgi Alın</h3>
                <p className="text-gray-500 text-sm mt-2">Formu doldurun, size ulaşalım</p>
              </div>
              <LeadForm variantId={4} showTitle={false} className="[&_input]:border-gray-200 [&_input]:focus:border-[#0a1628] [&_button]:bg-[#0a1628] [&_button]:hover:bg-[#dd222c] [&_button]:text-white [&_button]:font-bold" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
