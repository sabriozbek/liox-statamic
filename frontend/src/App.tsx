import { Routes, Route, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { getSiteSettings, trackEvent } from '@/services/api'
import { injectGoogleTagManager, storeSiteSettings } from '@/lib/siteSettings'
import Layout from '@/components/layout/Layout'
import ScrollToTop from '@/components/layout/ScrollToTop'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PopupWidget from '@/components/forms/PopupWidget'
import Home from '@/pages/Home'
import ErpPage from '@/pages/ErpPage'
import ModulesPage from '@/pages/ModulesPage'
import ModulePage from '@/pages/ModulePage'
import SectorsPage from '@/pages/SectorsPage'
import SectorLanding from '@/pages/SectorLanding'
import TestimonialsPage from '@/pages/TestimonialsPage'
import Contact from '@/pages/Contact'
import ThankYouPage from '@/pages/ThankYouPage'
import GenericPage from '@/pages/GenericPage'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import BlogCategory from '@/pages/BlogCategory'
import EventsPage from '@/pages/EventsPage'
import EventDetailPage from '@/pages/EventDetailPage'
import NewsPage from '@/pages/NewsPage'
import NewsDetailPage from '@/pages/NewsDetailPage'
import NotFoundPage from '@/pages/NotFoundPage'

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

  return (
    <>
      <ScrollToTop />
      <Header onDemoClick={handleDemoClick} hidden={(isNotFoundRoute || forceShowHeader) ? false : isFooterVisible} />
      {!isHome && <div className="h-[88px] md:h-[100px] lg:h-[108px]" />}
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
      <PopupWidget />
      <Footer />
    </>
  )
}

export default App
