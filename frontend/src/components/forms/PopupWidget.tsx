import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import api from '@/services/api'
import LeadForm from '@/components/forms/LeadForm'
import { getCtaVariantsFromSettings } from '@/lib/siteSettings'

interface PopupConfig {
  id?: string
  slug?: string
  title: string
  description: string
  iframe_src?: string
  image?: string
  icon_class?: string
  badge_text?: string
  popup_type?: string
  trigger_type?: string
  cta_enabled?: boolean
  cta_label?: string
  cta_url?: string
  form_layout?: string
  delay_seconds?: number
  scroll_percent?: number | null
  frequency?: string
  show_again_after?: number
  position?: string
  embed_mode?: string
  pages?: string[]
  exclude_pages?: string[]
  design?: string
  size?: string
  is_active?: boolean
}

export default function PopupWidget() {
  const popupVariants = getCtaVariantsFromSettings()
  const popupVariant = (popupVariants as Record<string, any> | null)?.['4'] || null
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [popupContent, setPopupContent] = useState<PopupConfig | null>(null)
  const [popupQueue, setPopupQueue] = useState<PopupConfig[]>([])
  const [isBlogTriggered, setIsBlogTriggered] = useState(false)

  const getStorageKey = (popup: PopupConfig) => `popup_dismissed_${popup.slug || popup.id || 'default'}`
  const getSessionKey = (popup: PopupConfig) => `popup_session_count_${popup.slug || popup.id || 'default'}`

  const isDismissedByRule = (popup: PopupConfig) => {
    const raw = localStorage.getItem(getStorageKey(popup))
    if (!raw) return false

    try {
      const parsed = JSON.parse(raw)
      if (!parsed?.dismissedAt) return true
      const dismissedAt = new Date(parsed.dismissedAt).getTime()
      const days = popup.show_again_after || 7
      return Date.now() < dismissedAt + (days * 24 * 60 * 60 * 1000)
    } catch {
      return true
    }
  }

  const enqueuePopup = (popup: PopupConfig) => {
    setPopupQueue((prev) => {
      const exists = prev.some((item) => (item.slug || item.id) === (popup.slug || popup.id))
      return exists ? prev : [...prev, popup]
    })
  }

  useEffect(() => {
    let exitIntentTriggered = false
    let timers: number[] = []
    const cleanups: Array<() => void> = []

    api.get<PopupConfig[]>('/popups')
      .then((response) => {
        const currentPath = window.location.pathname
        const all = response.data || []

        const eligiblePopups = all.filter((item) => {
          if (!item?.is_active) return false
          const pages = item.pages || []
          const excludePages = item.exclude_pages || []
          if (excludePages.includes(currentPath)) return false
          if (pages.length > 0 && !pages.includes(currentPath)) return false
          if (isDismissedByRule(item)) return false

          const sessionCount = parseInt(sessionStorage.getItem(getSessionKey(item)) || '0')
          if ((item.frequency || 'once_per_session') === 'once_per_session' && sessionCount >= 1) return false

          return true
        })

        eligiblePopups.forEach((popup) => {
          const showPopup = () => {
            const sessionKey = getSessionKey(popup)
            const sessionCount = parseInt(sessionStorage.getItem(sessionKey) || '0')
            sessionStorage.setItem(sessionKey, String(sessionCount + 1))
            enqueuePopup(popup)
          }

          if (popup.trigger_type === 'exit_intent') {
            const onMouseLeave = (event: MouseEvent) => {
              if (exitIntentTriggered) return
              if (event.clientY <= 0) {
                exitIntentTriggered = true
                showPopup()
              }
            }
            document.addEventListener('mouseleave', onMouseLeave)
            cleanups.push(() => document.removeEventListener('mouseleave', onMouseLeave))
            return
          }

          if (popup.trigger_type === 'scroll_depth' && popup.scroll_percent) {
            const onScroll = () => {
              const scrolled = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
              if (scrolled >= Number(popup.scroll_percent)) {
                showPopup()
                window.removeEventListener('scroll', onScroll)
              }
            }
            window.addEventListener('scroll', onScroll)
            cleanups.push(() => window.removeEventListener('scroll', onScroll))
            return
          }

          if (popup.trigger_type === 'manual') {
            enqueuePopup(popup)
            return
          }

          const timer = window.setTimeout(showPopup, (popup.delay_seconds || 5) * 1000)
          timers.push(timer)
        })
      })
      .catch(() => {
        setPopupContent(null)
      })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  // Listen for blog popup triggers
  useEffect(() => {
    const handleBlogPopupTrigger = () => {
      const defaultPopup: PopupConfig = {
        id: 'blog-demo-popup',
        title: 'Demo Talep Formu',
        description: 'LIOX ERP hakkında detaylı bilgi almak için formu doldurun.',
        form_layout: 'vertical',
        popup_type: 'form_popup',
        trigger_type: 'manual',
        design: 'dark',
        size: 'medium',
        is_active: true,
      }

      setPopupContent(defaultPopup)
      setIsVisible(true)
      setIsDismissed(false)
    }

    window.addEventListener('open-demo-popup', handleBlogPopupTrigger)
    return () => window.removeEventListener('open-demo-popup', handleBlogPopupTrigger)
  }, [popupContent])

  useEffect(() => {
    if (!popupContent && popupQueue.length > 0) {
      setPopupContent(popupQueue[0])
      setIsVisible(true)
      setIsDismissed(false)
      setPopupQueue((prev) => prev.slice(1))
    }
  }, [popupQueue, popupContent])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (popupContent) {
      localStorage.setItem(getStorageKey(popupContent), JSON.stringify({ dismissedAt: new Date().toISOString() }))
    }
    setTimeout(() => {
      setPopupContent(null)
      setIsVisible(false)
      setIsDismissed(false)
    }, 120)
  }

  const handleFormSuccess = () => {
    window.setTimeout(() => {
      handleDismiss()
    }, 1200)
  }

  if (!isVisible || isDismissed || !popupContent) {
    return null
  }

  const popupPositionClass = popupContent.position === 'topLeft'
    ? 'items-start justify-start'
    : popupContent.position === 'topRight'
      ? 'items-start justify-end'
      : popupContent.position === 'bottomLeft'
        ? 'items-end justify-start'
        : popupContent.position === 'bottomRight'
          ? 'items-end justify-end'
          : 'items-center justify-center'

  const popupWidthClass = popupContent.size === 'small'
    ? 'max-w-sm'
    : popupContent.size === 'large'
      ? 'max-w-3xl'
      : popupContent.size === 'fullscreen'
        ? 'max-w-5xl w-full h-[85vh]'
        : 'max-w-lg'

  const isCornerMode = popupContent.embed_mode === 'corner' || popupContent.popup_type === 'mini_widget'

  if (popupContent.popup_type === 'notification') {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-[420px] z-50 rounded-2xl border border-gray-200 bg-white shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Kapat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="pr-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0a1628]/10 text-[#dd222c] flex items-center justify-center shrink-0 border border-[#0a1628]/10">
              <i className={popupContent.icon_class || 'fa-solid fa-bell'} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-500">{popupContent.badge_text || 'Bildirim'}</div>
            </div>
          </div>
          <div className="text-lg font-black text-secondary font-logo mb-2">{popupContent.title}</div>
          <div className="text-sm text-gray-600 mb-4">{popupContent.description}</div>
          {popupContent.cta_enabled !== false && (
            <a
              href={popupContent.cta_url || '/iletisim'}
              onClick={handleDismiss}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[#0a1628] text-white text-sm font-black hover:bg-[#dd222c] transition"
            >
              {popupContent.cta_label || 'İncele'}
            </a>
          )}
        </div>
      </div>
    )
  }

  if (popupContent.popup_type === 'mini_widget' || isCornerMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-[320px] rounded-2xl border border-gray-200 bg-white shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Kapat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="pr-7">
          <div className="text-sm font-black text-secondary font-logo mb-2">{popupContent.title}</div>
          <div className="text-xs text-gray-600 mb-4">{popupContent.description}</div>
          <a
            href={popupContent.cta_url || '/iletisim'}
            onClick={handleDismiss}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#dd222c] text-white text-sm font-black hover:bg-[#b90e16] transition"
          >
            {popupContent.cta_label || 'Demo Talep Et'}
          </a>
        </div>
      </div>
    )
  }

  if (popupContent.popup_type === 'form_popup') {
    const isCompactBottomRight = popupContent.form_layout === 'compact_bottom_right'
    const formPopupPositionClass = isCompactBottomRight ? 'items-end justify-end' : popupPositionClass

    const isCompactBySize = popupContent.size === 'small'

    const formPopupLayout = popupContent.form_layout === 'form_left_content_right'
      ? 'lg:grid-cols-[0.78fr_1.22fr]'
      : 'lg:grid-cols-[1.22fr_0.78fr]'

    const formPopupOrderLeft = popupContent.form_layout === 'form_left_content_right' ? 'lg:order-2' : 'lg:order-1'
    const formPopupOrderRight = popupContent.form_layout === 'form_left_content_right' ? 'lg:order-1' : 'lg:order-2'

    const formPopupTheme = popupContent.design === 'dark'
      ? 'bg-slate-950 text-white border-slate-800'
      : popupContent.design === 'gradient'
        ? 'bg-gradient-to-br from-[#0a1628] to-[#dd222c] text-white border-white/20'
        : 'bg-white text-slate-900 border-white/40'

    const formPopupLeftTheme = popupContent.design === 'dark'
      ? 'bg-[radial-gradient(circle_at_top_left,_rgba(221,34,44,0.2),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]'
      : popupContent.design === 'gradient'
        ? 'bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%)]'
        : 'bg-[radial-gradient(circle_at_top_left,_rgba(221,34,44,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(24,60,104,0.14),_transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]'

    const closeBtnTheme = popupContent.design === 'dark' || popupContent.design === 'gradient'
      ? 'bg-white/90 text-slate-700 border-slate-300'
      : 'bg-white/90 text-slate-700 border-slate-300'

    return (
      <>
        <div
          className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 transition-opacity"
          onClick={handleDismiss}
        />
        <div className={`fixed inset-0 z-50 flex p-4 md:p-6 ${formPopupPositionClass}`}>
          <div
            className={cn(
              `relative w-full ${popupWidthClass} rounded-[2.5rem] overflow-hidden border shadow-[0_30px_100px_rgba(15,23,42,0.35)] animate-in fade-in zoom-in-95 duration-300`,
              formPopupTheme,
              popupContent.size === 'small' && 'max-w-[430px] h-auto max-h-[86vh] rounded-[2rem]',
              popupContent.size === 'medium' && 'max-w-5xl max-h-[88vh]',
              popupContent.size === 'large' && 'max-w-[1280px]',
              popupContent.size === 'fullscreen' && 'max-w-[1400px] h-[88vh]',
              isCompactBottomRight && 'max-w-[380px] rounded-[2rem]'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDismiss}
              className={cn(
                'absolute top-5 right-5 z-20 w-14 h-14 rounded-full border hover:text-slate-900 hover:border-slate-400 transition-colors',
                closeBtnTheme,
              )}
              aria-label="Kapat"
            >
              <svg className="w-7 h-7 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={cn(
              (isCompactBottomRight || isCompactBySize) ? 'grid lg:grid-cols-1 min-h-[unset]' : `grid ${formPopupLayout} min-h-[640px]`,
              popupContent.position === 'center' ? '' : ''
            )}>
              <div className={cn(
                `relative p-6 md:p-8 lg:p-10 flex flex-col justify-center ${formPopupLeftTheme}`,
                formPopupOrderLeft,
                popupContent.size === 'small' && 'p-6 md:p-7',
                popupContent.size === 'medium' && 'p-6 md:p-7 lg:p-8',
                (isCompactBottomRight || isCompactBySize) && 'hidden'
              )}>
                <div className="absolute inset-0 pointer-events-none opacity-25 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:30px_30px]" />
                <div className="relative max-w-md space-y-4">
                  <div className="flex items-center justify-start gap-3 text-left">
                    <span className={cn('text-2xl md:text-3xl font-logo', popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'text-white' : 'text-[#dd222c]')}>LioXERP</span>
                    <span className={cn('w-px h-8', popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'bg-white/25' : 'bg-slate-300')} />
                    <span className={cn('text-2xl md:text-3xl font-black', popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'text-white' : 'text-[#dd222c]')}>uyumsoft</span>
                  </div>
                  <h3 className={cn('text-3xl md:text-4xl lg:text-5xl leading-[1.02] font-black font-logo', popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'text-white' : 'text-secondary')}>
                    {popupContent.title}
                  </h3>
                  <p className={cn('text-base md:text-lg leading-relaxed max-w-md whitespace-pre-line', popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'text-white/85' : 'text-gray-700')}>
                    {popupContent.description}
                  </p>
                  {popupContent.image ? (
                    <div className={cn('rounded-[2rem] overflow-hidden shadow-xl max-w-xl', popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'border border-white/15 bg-white/5' : 'border border-gray-200 bg-white')}>
                      <img src={popupContent.image} alt={popupContent.title} className="w-full h-full object-cover min-h-[280px]" />
                    </div>
                  ) : null}
                </div>
              </div>

              {(isCompactBottomRight || isCompactBySize) ? (
                <div className="relative p-5 bg-white/95 text-slate-900 max-h-[86vh] overflow-y-auto">
                  <div className="w-full max-w-[380px] mx-auto">
                    <div className="mb-4 pr-10">
                      <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-500 mb-2">Hızlı Bilgi Formu</div>
                      <div className="text-lg font-black text-secondary font-logo leading-tight">{popupVariant?.formTitle || popupContent.title}</div>
                      {(popupVariant?.formSubtitle || popupContent.description) ? <div className="text-xs text-gray-700 mt-2 leading-relaxed">{popupVariant?.formSubtitle || popupContent.description}</div> : null}
                    </div>
                    <LeadForm variantId={4} showTitle={false} compact={true} redirectOnSuccess={false} onSuccess={handleFormSuccess} className="w-full max-w-none p-0 shadow-none border-0 bg-transparent rounded-none [&_form]:space-y-3" />
                  </div>
                </div>
              ) : (
                <div className={cn(
                  'relative flex items-center justify-center overflow-y-auto',
                  popupContent.design === 'dark' || popupContent.design === 'gradient' ? 'border-l border-white/10 bg-white/95 text-slate-900' : 'border-l border-slate-200/80 bg-white',
                  formPopupOrderRight,
                  popupContent.size === 'small' && 'p-4 md:p-5',
                  popupContent.size === 'medium' && 'p-5 md:p-6',
                  popupContent.size === 'large' && 'p-6 md:p-8 lg:p-10'
                )}>
                  <div className={cn(
                    'w-full mx-auto',
                    popupContent.size === 'small' && 'max-w-[360px]',
                    popupContent.size === 'medium' && 'max-w-[520px]',
                    popupContent.size === 'large' && 'max-w-[620px]'
                  )}>
                    <LeadForm variantId={4} showTitle={false} compact={true} redirectOnSuccess={false} onSuccess={handleFormSuccess} className="w-full max-w-none p-0 shadow-none border-0 bg-transparent rounded-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Backdrop */}
      {!isCornerMode && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={handleDismiss}
        />
      )}

      {/* Popup */}
      <div className={`fixed inset-0 z-50 flex p-4 ${popupPositionClass}`}>
        <div 
          className={cn(
            `bg-white rounded-2xl shadow-2xl ${popupWidthClass} w-full p-8 relative`,
            popupContent.design === 'dark' && 'bg-slate-950 text-white',
            popupContent.design === 'gradient' && 'bg-gradient-to-br from-[#0a1628] to-[#dd222c] text-white',
            "animate-in fade-in zoom-in-95 duration-300"
          )}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
            <div className="text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 bg-gray-100 text-[11px] uppercase tracking-[0.22em] font-bold text-gray-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dd222c] shadow-[0_0_0_4px_rgba(221,34,44,0.12)]" />
              <span>LIOX ERP</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black font-logo text-gray-900 mb-3 leading-tight">
              {popupContent.title}
            </h3>

            <p className="text-gray-700 mb-6 leading-relaxed max-w-[32rem] mx-auto">
              {popupContent.description}
            </p>

            {/* Video Embed (if available) */}
            {popupContent.iframe_src && (
              <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
                <iframe
                  src={popupContent.iframe_src}
                  title="Demo Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {!popupContent.iframe_src && popupContent.image && (
              <div className="rounded-xl overflow-hidden mb-6">
                <img src={popupContent.image} alt={popupContent.title} className="w-full h-56 object-cover" />
              </div>
            )}

            <div className="flex gap-3 items-stretch">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition"
              >
                Şimdi Değil
              </button>
              <a
                href={popupContent.cta_url || '/iletisim'}
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 rounded-xl font-black text-sm transition text-center cursor-pointer shadow-lg bg-[#0a1628] text-white hover:bg-[#dd222c] hover:scale-[1.02]"
              >
                {popupContent.cta_label || 'Randevu Al'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
