import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const scrollToForm = () => {
    const path = location.pathname
    
    // On sector/module pages with #form section
    if (path.startsWith('/sektor/') || path.startsWith('/modul/')) {
      const formSection = document.getElementById('form')
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    
    // On home page - scroll to form area
    if (isHome) {
      const formArea = document.getElementById('form-area')
      if (formArea) {
        formArea.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    
    // On other pages - redirect to contact page
    window.location.href = '/iletisim'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onDemoClick={scrollToForm} />
      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
