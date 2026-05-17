import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getPageContent, type HomePageContent } from '@/services/api'

export default function ThankYouPage() {
  const [content, setContent] = useState<HomePageContent | null>(null)

  useEffect(() => {
    getPageContent('tesekkurler')
      .then((data) => setContent(data))
      .catch(() => {
        setContent({
          title: 'Teşekkürler',
          generic_hero_baslik: 'Teşekkürler!',
          generic_hero_aciklama: 'Formunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.',
        })
      })
  }, [])

  return (
    <>
      {/* Hero Section - Dark Navy with Shapes */}
      <section className="bg-[#0a1628] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
          <div className="mx-auto mb-6 w-18 h-18 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl text-white">
            <i className="fa-solid fa-check" />
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] uppercase tracking-[0.2em] font-semibold mb-6">
            Başarılı Gönderim
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-logo uppercase mb-5">
            {content?.generic_hero_baslik || content?.title || 'Teşekkürler!'}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            {content?.generic_hero_aciklama || 'Formunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.'}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[2rem] border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-8 md:p-10 shadow-sm text-center">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-logo mb-4">
              Talebiniz ekibimize ulaştı
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Uzman ekibimiz bilgilerinizi inceleyip size en uygun çözüm kurgusuyla en kısa sürede dönüş sağlayacak.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#0a1628] text-white font-black hover:bg-[#dd222c] transition shadow-lg">
                Ana Sayfaya Dön
              </Link>
              <Link to="/moduller" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 font-black hover:border-[#dd222c] hover:text-[#dd222c] transition shadow-sm">
                Modülleri İncele
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
