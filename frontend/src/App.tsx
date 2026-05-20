import { Routes, Route, useLocation } from 'react-router'
import { useEffect, useState, lazy, Suspense } from 'react'
import { getSiteSettings, trackEvent } from '@/services/api'
import { injectGoogleTagManager, storeSiteSettings } from '@/lib/siteSettings'
import Layout from '@/components/layout/Layout'
import ScrollToTop from '@/components/layout/ScrollToTop'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PopupWidget from '@/components/forms/PopupWidget'
const Home = lazy(() => import('@/pages/Home'))
const ErpPage = lazy(() => import('@/pages/ErpPage'))
const ModulesPage = lazy(() => import('@/pages/ModulesPage'))
const ModulePage = lazy(() => import('@/pages/ModulePage'))
const SectorsPage = lazy(() => import('@/pages/SectorsPage'))
const SectorLanding = lazy(() => import('@/pages/SectorLanding'))
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'))
const Contact = lazy(() => import('@/pages/Contact'))
const ThankYouPage = lazy(() => import('@/pages/ThankYouPage'))
const GenericPage = lazy(() => import('@/pages/GenericPage'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const BlogCategory = lazy(() => import('@/pages/BlogCategory'))
const EventsPage = lazy(() => import('@/pages/EventsPage'))
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage'))
const NewsPage = lazy(() => import('@/pages/NewsPage'))
const NewsDetailPage = lazy(() => import('@/pages/NewsDetailPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="mx-auto h-10 w-10 rounded-full border-4 border-[#0a1628]/10 border-t-[#dd222c] animate-spin" />
        <p className="text-sm font-semibold tracking-[0.12em] uppercase text-gray-500">Yükleniyor</p>
      </div>
    </section>
  )
}

function isKnownRoute(pathname: string) {
  if (
    pathname === '/' ||
    pathname === '/erp' ||
    pathname === '/modul' ||
    pathname === '/sektorler' ||
    pathname === '/neden-lioxerp' ||
    pathname === '/basari-hikayeleri' ||
    pathname === '/iletisim' ||
    pathname === '/tesekkurler' ||
    pathname === '/gizlilik-politikasi' ||
    pathname === '/kullanim-sartlari' ||
    pathname === '/kvkk' ||
    pathname === '/blog' ||
    pathname === '/etkinlik' ||
    pathname === '/haber'
  ) {
    return true
  }

  if (pathname.startsWith('/modul/') || pathname.startsWith('/sektor/') || pathname.startsWith('/blog/') || pathname.startsWith('/etkinlik/') || pathname.startsWith('/haber/')) {
    return true
  }

  return false
}

function App() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [forceShowHeader, setForceShowHeader] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isNotFoundRoute = !isKnownRoute(location.pathname)

  const handleDemoClick = () => {
    // Scroll to form or open modal
    document.getElementById('form-area')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        storeSiteSettings(settings)
        injectGoogleTagManager(settings.google_tag_manager_id)
      })
      .catch((error: unknown) => {
        console.error('Site settings yüklenemedi:', error)
      })
  }, [])

  useEffect(() => {
    trackEvent('page_view', {
      page_path: location.pathname,
      page_title: typeof document !== 'undefined' ? document.title : '',
    }).catch(() => {
      // noop
    })
  }, [location.pathname])

  useEffect(() => {
    setIsFooterVisible(false)
    setHasScrolled(false)
    setForceShowHeader(document.body.dataset.lioxForceHeader === '1')

    const footer = document.getElementById('site-footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    observer.observe(footer)

    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 24) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const shouldHideHeader = (isNotFoundRoute || forceShowHeader)
    ? false
    : (hasScrolled && isFooterVisible)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Header onDemoClick={handleDemoClick} hidden={shouldHideHeader} />
      <Suspense fallback={<PageLoader />}>
        {!isHome && <div className="h-[88px] md:h-[100px] lg:h-[108px]" />}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="erp" element={<ErpPage />} />
            <Route path="modul" element={<ModulesPage />} />
            <Route path="modul/:slug" element={<ModulePage />} />
            <Route path="sektorler" element={<SectorsPage />} />
            <Route path="sektor/:slug" element={<SectorLanding />} />
            <Route path="neden-lioxerp" element={<GenericPage fixedSlug="neden-lioxerp" />} />
            <Route path="basari-hikayeleri" element={<TestimonialsPage />} />
            <Route path="iletisim" element={<Contact />} />
            <Route path="tesekkurler" element={<ThankYouPage />} />
            <Route path="gizlilik-politikasi" element={<GenericPage fixedSlug="gizlilik-politikasi" />} />
            <Route path="kullanim-sartlari" element={<GenericPage fixedSlug="kullanim-sartlari" />} />
            <Route path="kvkk" element={<GenericPage fixedSlug="kvkk" />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="etkinlik" element={<EventsPage />} />
            <Route path="etkinlik/:slug" element={<EventDetailPage />} />
            <Route path="haber" element={<NewsPage />} />
            <Route path="haber/:slug" element={<NewsDetailPage />} />
            <Route path="kategori/:slug" element={<BlogCategory />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <PopupWidget />
        <Footer />
      </Suspense>
    </div>
  )
}

export default App
