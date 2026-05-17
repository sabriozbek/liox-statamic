import { useState, useEffect } from 'react'
import LeadForm from '@/components/forms/LeadForm'
import { getHomePageContent, type HomePageContent } from '@/services/api'
import {
  HERO_CONTENT,
  HERO_FEATURES,
  CUSTOMER_LOGOS,
  SUCCESS_STORIES,
  MODULES,
  SECTORS,
  SECTOR_TABS,
  ROLE_PROFILES,
  CTA_VARIANTS,
  DEFAULT_POPUP_VIDEO_EMBED_URL,
} from '@/lib/constants'
import { getMessageVariantsFromSettings } from '@/lib/siteSettings'

export default function Home() {
  const [pageContent, setPageContent] = useState<HomePageContent | null>(() => {
    if (window.__LIOX_HOME_PAGE_CONTENT__) {
      return window.__LIOX_HOME_PAGE_CONTENT__ as HomePageContent
    }

    try {
      const raw = window.localStorage.getItem('liox-home-page-content')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [activeSectorId, setActiveSectorId] = useState(SECTOR_TABS[0].id)
  const [selectedRoleId, setSelectedRoleId] = useState(ROLE_PROFILES[0].id)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)

  const fallbackVideoItems = [
    {
      src: 'https://www.youtube.com/embed/i4HvKelhKJc',
      title: 'Neden LIOX ERP? - Yerli ERP',
    },
    {
      src: 'https://www.youtube.com/embed/X81EL_12dL8',
      title: 'Neden LIOX ERP? - Sektörünüze Özel',
    },
    {
      src: 'https://www.youtube.com/embed/FbA6jREFOQs',
      title: 'Neden LIOX ERP? - Güncel Altyapı',
    },
    {
      src: 'https://www.youtube.com/embed/FLVpybhWeSE',
      title: 'Neden LIOX ERP? - Rekabet Gücü',
    },
    {
      src: 'https://www.youtube.com/embed/b3q9Unoqz_A',
      title: 'LIOX ERP ile İşletmenizi Şimdi Uçtan Uca Yönetmeye Başlayın!',
    },
  ]

  const modulesData = (Array.isArray(pageContent?.moduller) && pageContent?.moduller?.length ? pageContent.moduller : MODULES) as unknown as Module[]
  const sectorTabsData = (Array.isArray(pageContent?.sektor_tableri) && pageContent?.sektor_tableri?.length ? pageContent.sektor_tableri : SECTOR_TABS) as Array<Record<string, unknown>>
  const roleProfilesData = (Array.isArray(pageContent?.role_profiles) && pageContent?.role_profiles?.length ? pageContent.role_profiles : ROLE_PROFILES) as Array<Record<string, unknown>>
  const videoItems = (Array.isArray(pageContent?.video_slider_items) && pageContent?.video_slider_items?.length ? pageContent.video_slider_items : fallbackVideoItems) as Array<{ src: string; title: string }>
  const mobileFeatures = (Array.isArray(pageContent?.mobil_ozellikler) && pageContent?.mobil_ozellikler?.length ? pageContent.mobil_ozellikler : [
    { title: 'Mekan Bağımsız Erişim', description: 'iOS, iPadOS, Android ve macOS (Apple Silicon) desteği ile her yerde erişim.' },
    { title: 'Gerçek Zamanlı Yönetim', description: 'Finans, satış, üretim ve depo süreçlerini anlık takip edin ve yönetin.' },
    { title: 'Güvenli ve Hızlı', description: 'Sürekli performans iyileştirmeleri, kullanıcı geri bildirimlerine göre yenilikler.' },
  ]) as Array<{ title: string; description: string }>

  const activeStory = SUCCESS_STORIES[activeStoryIndex]
  const activeStoryLogo = CUSTOMER_LOGOS.find(l => l.id === activeStory?.logoId)
  const activeSector = (sectorTabsData.find((s) => s.id === activeSectorId) || sectorTabsData[0]) as any
  const activeRole = (roleProfilesData.find((r) => r.id === selectedRoleId) || roleProfilesData[0]) as any
  const activeRoleModules = modulesData.filter(m => Array.isArray(activeRole.modules) && activeRole.modules.includes(m.id))
  const settingsMessageVariants = getMessageVariantsFromSettings()
  const activeMessageVariant = (settingsMessageVariants as Record<string, any> | null)?.['1'] || null
  
interface Module {
  id: string
  title: string
  icon?: string
  description: string
  longDescription?: string
  highlights?: readonly string[]
  mediaUrl?: string
}
  
  const activeModule: Module | null = activeModuleId
    ? (modulesData.find(m => m.id === activeModuleId) as unknown as Module) ?? null
    : null

  const scrollToForm = () => {
    document.getElementById('form-area')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    let mounted = true

    getHomePageContent()
      .then((data: HomePageContent | null) => {
        if (!data) return
        if (mounted) {
          setPageContent(data)
          try {
            window.localStorage.setItem('liox-home-page-content', JSON.stringify(data))
          } catch {
            // ignore cache errors
          }
          if (Array.isArray(data.sektor_tableri) && data.sektor_tableri.length > 0 && typeof data.sektor_tableri[0]?.id === 'string') {
            setActiveSectorId(String(data.sektor_tableri[0].id))
          }
          if (Array.isArray(data.role_profiles) && data.role_profiles.length > 0 && typeof data.role_profiles[0]?.id === 'string') {
            setSelectedRoleId(String(data.role_profiles[0].id))
          }
        }
      })
      .catch((error: unknown) => {
        console.error('Ana sayfa CP verisi yüklenemedi:', error)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      {/* Hero Section - Reference Style */}
      <section
        className="relative min-h-screen text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-800/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />

        {/* Announcement Bar */}
        <div className="relative z-10 w-full" style={{ backgroundColor: '#DC143C' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-3 overflow-hidden py-2.5 md:py-3 text-[13px] md:text-[15px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/30 text-[11px] md:text-[12px] uppercase tracking-[0.16em] font-semibold flex-shrink-0" style={{ color: '#DC143C', backgroundColor: 'rgba(255,255,255,0.95)' }}>
              <i className="fa-solid fa-cubes text-[9px] md:text-[10px]" />
              <span>Bu Modüller LIOX ERP'de</span>
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="announcement-marquee flex items-center gap-12 whitespace-nowrap">
                {[...modulesData, ...modulesData, ...modulesData].map((module, index) => (
                  <span key={`${module.id}-${index}`} className="flex items-center gap-2 text-white/90 hover:text-white">
                    <i className={`${module.icon} text-[12px] md:text-[13px] text-white/90`} />
                    <span className="text-[13px] md:text-[15px] leading-none">{module.title}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-180px)]">
            {/* Left Content */}
            <div className="lg:col-span-6 text-white space-y-6">
              <h2 className="text-uyumRed font-extrabold tracking-[0.4em] text-xs uppercase hidden md:block">
                {HERO_CONTENT.badge.text}
              </h2>
              <h1
                className="text-3xl md:text-4xl lg:text-6xl leading-[1.24] md:leading-[1.2] uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                style={{
                  fontFamily: '"Gilroy-ExtraBold", "Gilroy-Bold", "Gilroy-Heavy", ui-sans-serif, system-ui, sans-serif',
                  fontWeight: 800,
                }}
              >
                {pageContent?.hero_baslik || (Array.isArray(activeMessageVariant?.heroTitleLines) ? activeMessageVariant.heroTitleLines.join(' ') : `${HERO_CONTENT.headline.main} ${HERO_CONTENT.headline.gradient}`)}
              </h1>
              <p className="text-[15px] md:text-xl text-white/90 max-w-xl font-light leading-relaxed">
                {pageContent?.hero_alt_baslik || activeMessageVariant?.heroDescription || pageContent?.hero_aciklama || HERO_CONTENT.description}
              </p>
              
              {/* Hero Features */}
              <div className="grid sm:grid-cols-2 gap-4 md:gap-5 text-[13px] text-white">
                {HERO_FEATURES.slice(0, 2).map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white/10 rounded-2xl p-4 border border-white/20"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/25">
                        <i className={`${feature.icon} text-xs`} />
                      </div>
                      <div className="font-black text-sm text-white">{feature.title}</div>
                    </div>
                    <div className="text-white/80 text-xs mt-2">{feature.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Lead Form */}
            <div id="form-area" className="lg:col-span-6">
              <LeadForm variantId={1} showTitle={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Logos Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 items-center text-center">
              <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="fa-solid fa-trophy text-[#dd222c]" />
                Referanslarımız
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-logo uppercase text-[#0a1628]">
                Müşterilerimiz
              </h2>
              <div className="inline-flex flex-nowrap gap-2 text-[11px] text-gray-900 overflow-x-auto justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-100 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px]">
                    <i className="fa-solid fa-users" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Güvenilen tercih</span>
                    <span className="text-[11px] font-bold text-emerald-900">300.000+ müşteri</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-100 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#dd222c] text-white flex items-center justify-center text-[11px]">
                    <i className="fa-solid fa-award" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-700">Sektör deneyimi</span>
                    <span className="text-[11px] font-bold text-amber-900">29 yıllık Uyumsoft</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="bg-gray-50/70 rounded-3xl border border-gray-100 px-4 md:px-6 py-6 md:py-7">
                <div className="overflow-hidden rounded-2xl bg-white/70 border border-gray-100/80 shadow-sm">
                  <div
                    className="flex items-center gap-8 md:gap-10 min-w-max py-1 logo-marquee"
                  >
                    {CUSTOMER_LOGOS.concat(CUSTOMER_LOGOS).map((customer, index) => (
                      <div
                        key={`${customer.id}-${index}`}
                        className="group h-16 md:h-20 w-32 md:w-40 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-200/90"
                      >
                        <img
                          src={customer.logoSrc}
                          alt={customer.name}
                          className="h-9 md:h-10 max-w-[80%] object-contain transition duration-200 opacity-80 group-hover:opacity-100 group-hover:scale-[1.06]"
                          loading="lazy"
                        />
                      </div>
                    ))}
                    <div className="ml-4 text-[11px] md:text-xs font-semibold text-gray-700 whitespace-nowrap">
                      + çok daha fazlası{' '}
                      <span className="text-[#0a1628] font-black">LIOX ERP'yi</span> tercih etti.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="basari" className="py-16 bg-gradient-to-b from-white via-gray-50/60 to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-star text-[#dd222c]" />
              Başarı Hikayeleri
            </div>
            <h2 className="text-3xl font-black font-logo uppercase text-gray-900">
              LIOX ERP ile Operasyonlarını Güçlendiren{' '}
              <span className="text-[#dd222c]">Markalar</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-4">
              Farklı sektörlerden işletmelerin LIOX ERP ile yönetim kontrolünü nasıl sağladığını ve kârlılıklarını nasıl artırdığını izleyin.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_18px_60px_rgba(15,23,42,0.12)] overflow-hidden">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#dd222c]/5 blur-3xl" />
              <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-gray-800/5 blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
                {/* Left - Story Info */}
                <div className="md:w-5/12 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-auto flex items-center justify-center px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                        {activeStoryLogo ? (
                          <img
                            src={activeStoryLogo.logoSrc}
                            alt={activeStory?.company}
                            className="max-h-8 w-auto object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-[11px] font-semibold text-gray-600">{activeStory?.company}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-black text-gray-900">{activeStory?.company}</div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{activeStory?.sector}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{activeStory?.description}</p>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveStoryIndex(prev => prev === 0 ? SUCCESS_STORIES.length - 1 : prev - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#dd222c] hover:text-[#dd222c] transition bg-white"
                      >
                        <i className="fa-solid fa-chevron-left text-[10px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStoryIndex(prev => (prev + 1) % SUCCESS_STORIES.length)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#dd222c] hover:text-[#dd222c] transition bg-white"
                      >
                        <i className="fa-solid fa-chevron-right text-[10px]" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      {SUCCESS_STORIES.map((story, index) => (
                        <button
                          key={story.id}
                          type="button"
                          onClick={() => setActiveStoryIndex(index)}
                          className={`h-1.5 rounded-full transition ${
                            index === activeStoryIndex ? 'w-5 bg-[#dd222c]' : 'w-2 bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right - Video */}
                <div className="md:w-7/12">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-black">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#dd222c]/30 via-transparent to-transparent pointer-events-none" />
                    {activeStory?.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${activeStory.youtubeId}`}
                        title={`${activeStory.company} - LioXERP Başarı Hikayesi`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full relative z-10"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-black to-gray-800 text-center px-6">
                        <p className="text-xs md:text-sm text-gray-100 font-semibold">
                          Bu başarı hikayesi için video içeriği yakında eklenecek.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="moduller" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <i className="fa-solid fa-cubes text-[#dd222c]" />
            ERP Modülleri
          </div>
          <h2 className="text-3xl font-black mb-4 font-logo uppercase text-gray-900" style={{ fontFamily: 'Gilroy, ui-sans-serif, system-ui, sans-serif', fontWeight: 800 }}>
            {pageContent?.moduller_baslik || 'İşletmenize Uyum Sağlayan Modüler LIOX ERP Yapısı'}
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12">
            {pageContent?.moduller_alt_baslik || 'İş süreçlerinize uygun entegre modüllerle işletmenizin ihtiyaçlarına göre şekillenen esnek bir yapı kurun.'}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
            {modulesData.map((module) => (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveModuleId(module.id)}
                className="text-left p-7 md:p-8 lg:p-9 rounded-3xl bg-white border-2 border-[#0a1628]/10 hover:border-[#dd222c] transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              >
                <div>
                  {module.icon && (
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#0a1628] text-white flex items-center justify-center mb-3 shadow-sm">
                      <i className={`${module.icon} text-sm md:text-base`} />
                    </div>
                  )}
                  <h4 className="font-black mb-2 uppercase text-sm text-gray-900">{module.title}</h4>
                  <p className="text-xs text-gray-500">{module.description}</p>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#dd222c] mt-1">
                  Detaylı İncele
                  <i className="fa-solid fa-arrow-right text-[9px]" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Module Detail Modal */}
      {activeModule && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 md:px-6"
          onClick={() => setActiveModuleId(null)}
        >
          <div
            className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-[0_24px_80px_rgba(15,23,42,0.35)] border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModuleId(null)}
              className="absolute right-3 top-3 md:right-5 md:top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-secondary border border-secondary/40 hover:bg-secondary hover:text-white transition"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
            
            {/* Left - Content */}
            <div className="w-full md:w-3/5 p-5 md:p-8 lg:p-9 overflow-auto">
              <div className="flex items-center gap-3 mb-4">
                {activeModule?.icon && (
                  <div className="w-10 h-10 rounded-2xl bg-uyumRed text-white flex items-center justify-center shadow-sm shadow-black/10">
                    <i className={`${activeModule?.icon} text-sm`} />
                  </div>
                )}
                <h3 className="text-2xl font-black text-secondary font-logo uppercase">{activeModule?.title}</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                {activeModule?.longDescription || activeModule?.description}
              </p>
              {activeModule?.highlights && activeModule.highlights.length > 0 && (
                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500 mb-2">
                    Öne çıkan yetenekler
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    {activeModule?.highlights?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-uyumRed flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Right - CTA */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-[#0a1628] to-[#0f2744] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-10 right-10 w-24 h-24 border border-white/10 rounded-full" />
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#dd222c]/20 rounded-full" />
              {activeModule?.mediaUrl ? (
                <div className="mb-5 overflow-hidden rounded-2xl border border-white/20 shadow-xl bg-white/10">
                  <img src={activeModule.mediaUrl} alt={activeModule.title} className="w-full h-52 object-cover" />
                </div>
              ) : null}
              <h4 className="text-xl font-black text-white mb-3 font-logo">Hemen Başlayın</h4>
              <p className="text-sm text-white/85 mb-6">
                {activeModule?.title} modülünü keşfedin, işletmeniz için nasıl fark yaratacağını görün.
              </p>
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full bg-white text-[#0a1628] py-3.5 rounded-xl font-bold uppercase text-sm hover:bg-gray-100 transition shadow-lg"
              >
                DEMO TALEP EDİN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rolünüzle Uyumlu ERP Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-user-gear text-[#dd222c]" />
              Kişiye Özel
            </div>
            <h2 className="text-3xl font-black font-logo uppercase text-gray-900" style={{ fontFamily: 'Gilroy, ui-sans-serif, system-ui, sans-serif', fontWeight: 800 }}>
              {pageContent?.roller_baslik || 'Rolünüzle Uyumlu ERP'}
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-4">
              {pageContent?.roller_aciklama || 'Her ünvan için öncelikli modüller ve yönetim araçlarıyla karar süreçlerinizi hızlandırın.'}
            </p>
          </div>
          <div className="mb-8 grid lg:grid-cols-3 gap-5 items-stretch">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-4 h-full">
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Rolünüzü seçin
                  </div>
                  <div className="text-base md:text-lg font-black text-gray-900">
                    LIOX ERP hangi modülleri sizin için öne çıkarıyor?
                  </div>
                </div>
                <div className="w-full max-w-md">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#0a1628]/20 bg-white text-sm md:text-base font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628] focus:border-[#0a1628]"
                  >
                    {roleProfilesData.map((role: any) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                {activeRole.description}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                    Önerilen modüller
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeRoleModules.length === 0 ? (
                      <span className="text-[11px] text-gray-500">
                        Bu rol için önerilen modüller yapılandırılmadı.
                      </span>
                    ) : (
                      activeRoleModules.map((module) => (
                        <div
                          key={module.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-semibold text-gray-700"
                        >
                          {module.icon && (
                            <i className={`${module.icon} text-[10px] text-[#dd222c]`} />
                          )}
                          <span>{module.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                    {activeRole.title} için LIOX ERP'nin 3 kritik faydası
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    {(activeRole.benefits || []).map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#dd222c] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative w-full max-w-[440px] mx-auto lg:mx-0 lg:justify-self-end h-full min-h-[260px]">
              {activeRole.mediaUrl ? (
                <>
                  <img src={activeRole.mediaUrl} alt={activeRole.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent" />
                  <div className="absolute left-0 right-0 bottom-0 p-6 text-white">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 mb-1">
                      {activeRole.label}
                    </div>
                    <div className="text-sm md:text-base font-black font-logo">
                      Her rol için LIOX ERP'nin sunduğu avantajları keşfedin.
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a1628]/10 to-[#0f2744]/10">
                  <i className="fa-solid fa-user text-gray-300 text-6xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sektörler Section */}
      <section id="sektorler" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-industry text-[#dd222c]" />
              Sektör Çözümleri
            </div>
            <h2 className="text-3xl font-black font-logo uppercase text-gray-900" style={{ fontFamily: 'Gilroy, ui-sans-serif, system-ui, sans-serif', fontWeight: 800 }}>
              {pageContent?.sektorler_baslik || 'Sektörün Dinamiklerine LIOX ERP ile Tam Uyum Sağlayın'}
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-4">
              {pageContent?.sektorler_aciklama || 'Sektörünüze göre tasarlanan LIOX ERP ile saha gerçeklerinize uyumlu entegre yönetim yapısı oluşturun.'}
            </p>
          </div>
          <div className="mb-6 -mx-2 overflow-x-auto">
            <div className="flex gap-2 px-2 pb-1">
              {sectorTabsData.map((sector: any) => {
                const isActive = sector.id === activeSectorId;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => setActiveSectorId(sector.id)}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] md:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0a1628] text-white shadow-md scale-100'
                          : 'bg-white text-[#0a1628] border border-[#0a1628]/20 hover:border-[#dd222c] hover:text-[#dd222c]'
                      }`}
                  >
                    {sector.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="grid md:grid-cols-3 gap-6 md:gap-10 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#dd222c]">
                  {activeSector.label} sektörü
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-logo" style={{ fontFamily: 'Gilroy, ui-sans-serif, system-ui, sans-serif', fontWeight: 800 }}>
                  {activeSector.heading}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activeSector.description}
                </p>
                <a
                  href={`/sektor/${activeSector.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a1628] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#dd222c] transition shadow-md"
                >
                  Sektör Sayfasını Aç
                  <i className="fa-solid fa-arrow-right text-[9px]" />
                </a>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-gray-600 mb-3">
                  Öne çıkan yetenekler
                </div>
                <ul className="text-xs text-gray-600 space-y-2">
                  {activeSector.items.map((item: string) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#dd222c] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobil Uygulama Section */}
      <section id="mobil-app" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-mobile-screen text-[#dd222c]" />
              Mobil Çözüm
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-logo uppercase text-[#0a1628]">
              {pageContent?.mobil_baslik || 'İşinizi Her Yerden Yönetin'}
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-3">
              {pageContent?.mobil_aciklama || 'Liox Mobil ile ekiplerinizle sahada veya ofiste anlık çalışın.'}
            </p>
          </div>
          <div className="mt-6">
            <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)] gap-6 md:gap-10 items-center">
              <div className="flex justify-center">
                <video
                  src={pageContent?.mobil_gorsel_url || '/assets/min-ERP mockup video.mp4'}
                  className="w-full max-w-xl md:max-w-2xl rounded-3xl object-cover block"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/assets/hero-bg.jpg"
                />
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                  {mobileFeatures.map((feature: { title: string; description: string }, index: number) => (
                  <div key={index} className="rounded-2xl border border-gray-100 bg-white p-4">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-gray-700 mb-2">
                      {feature.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {feature.description}
                    </div>
                  </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://apps.apple.com/us/app/liox/id1614796716"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-[11px] font-semibold hover:border-uyumRed hover:text-uyumRed transition"
                  >
                    <i className="fa-brands fa-apple text-[14px]" />
                    <span>App Store</span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.uyumsoft.uyumerp&hl=en_IE"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-[11px] font-semibold hover:border-uyumRed hover:text-uyumRed transition"
                  >
                    <i className="fa-brands fa-google-play text-[14px]" />
                    <span>Google Play</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uçtan Uca ERP Section - Dark Navy */}
      <section id="neden-lioxerp" className="py-16 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <i className="fa-solid fa-layer-group text-[#dd222c]" />
              Neden LIOX ERP
            </div>
            <h2 className="mt-4 text-3xl font-black font-logo uppercase text-white">
              {pageContent?.video_baslik || 'Uçtan Uca ERP ile Tek Platform'}
            </h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto mt-3">
              {pageContent?.video_alt_baslik || 'İşletmenize özel iş akışlarını tek noktadan yönetin. Finans, üretim, depo ve satış süreçlerini birleştirerek verimliliği artırın.'}
            </p>
          </div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 shadow-lg p-5 md:p-6">
            <div className="absolute -right-20 -top-20 w-64 h-64 border border-white/5 rounded-full" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 border border-[#dd222c]/10 rounded-full" />
            <div className="grid md:grid-cols-3 gap-4 relative z-10">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#dd222c]/20 flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-chart-line text-xl text-[#dd222c]" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Finansal Kontrol</h4>
                <p className="text-xs text-white/60">Nakit akışı, bütçe ve mali tabloları tek ekrandan takip edin.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#dd222c]/20 flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-industry text-xl text-[#dd222c]" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Üretim Verimliliği</h4>
                <p className="text-xs text-white/60">Fire kontrolü, kapasite planlaması ve maliyet analizi.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#dd222c]/20 flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-warehouse text-xl text-[#dd222c]" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Depo Yönetimi</h4>
                <p className="text-xs text-white/60">Stok takibi, lot/seri yönetimi ve sevkiyat planlaması.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Dark Navy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-play-circle text-[#dd222c]" />
              Video İçerikler
            </div>
            <h2 className="mt-4 text-3xl font-black font-logo uppercase text-gray-900">
              Uçtan Uca <span className="text-[#dd222c]">ERP</span> ile Tek Platform
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-3">
              İşletmenize özel iş akışlarını tek noktadan yönetin. Finans, üretim, depo ve satış süreçlerini birleştirerek verimliliği artırın.
            </p>
          </div>
          <div className="relative bg-[#0a1628] rounded-3xl shadow-lg p-5 md:p-6 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 border border-white/5 rounded-full" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 border border-[#dd222c]/10 rounded-full" />
            <div className="flex items-center gap-3 md:gap-6 relative z-10">
              {[-1, 0, 1].map((offset) => {
                const index = (activeVideoIndex + offset + videoItems.length) % videoItems.length
                const video = videoItems[index]
                const isCenter = offset === 0

                return (
                  <button
                    key={video.src}
                    type="button"
                    onClick={() => setActiveVideoIndex(index)}
                    className={`relative flex-1 rounded-2xl overflow-hidden transition-transform duration-300 ease-out ${
                      isCenter
                        ? 'scale-100 shadow-xl border-2 border-white/20 md:hover:scale-[1.02]'
                        : 'hidden md:block scale-95 shadow-md border-2 border-white/10 hover:scale-100'
                    }`}
                  >
                    <div className="relative w-full pt-[56.25%]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#dd222c]/30 via-transparent to-transparent pointer-events-none" />
                      <iframe
                        src={`${video.src}?rel=0&modestbranding=1&controls=0&playsinline=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 relative z-10">
              <div className="text-[11px] text-white/70">
                {videoItems[activeVideoIndex].title}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVideoIndex((activeVideoIndex - 1 + videoItems.length) % videoItems.length)}
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-[#dd222c] hover:text-[#dd222c] transition bg-white/10"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVideoIndex((activeVideoIndex + 1) % videoItems.length)}
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-[#dd222c] hover:text-[#dd222c] transition bg-white/10"
                >
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Navy */}
      <section className="py-16 bg-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 border border-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-white/5 rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-[#dd222c] rounded-full opacity-20 animate-pulse-slow" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 z-10">
          <div className="relative overflow-hidden rounded-[2rem] px-6 py-7 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            <div className="relative space-y-3 text-left max-w-3xl">
              <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white shadow-sm">
                ERP Dönüşüm Yolculuğu
              </div>

              <h3 className="text-[26px] md:text-[38px] font-black text-white leading-[1.08] font-logo">
                {(pageContent?.cta_baslik || 'Demo talep edin, süreçlerinize en uygun LIOX ERP kurgusunu birlikte planlayalım') + '.'}
              </h3>

              <p className="text-[15px] md:text-[17px] leading-relaxed text-white/80 max-w-2xl">
                {pageContent?.cta_aciklama || 'İhtiyaçlarınıza göre modül, kapsam ve uygulama adımlarını netleştirelim. Kısa bir görüşme ile size özel yol haritasını çıkaralım.'}
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <button
                type="button"
                onClick={scrollToForm}
                className="min-w-[250px] px-8 py-4 rounded-2xl font-black uppercase shadow-xl transition-all duration-200 cursor-pointer bg-white text-[#0a1628] hover:bg-[#dd222c] hover:text-white hover:-translate-y-0.5"
              >
                {pageContent?.cta_buton_metin || 'DEMO TALEP EDİN'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
