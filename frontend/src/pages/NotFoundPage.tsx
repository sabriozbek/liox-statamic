import { Link } from 'react-router'
import { useEffect } from 'react'

export default function NotFoundPage() {
  useEffect(() => {
    document.body.dataset.lioxForceHeader = '1'

    return () => {
      delete document.body.dataset.lioxForceHeader
    }
  }, [])

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[radial-gradient(circle_at_top,rgba(10,22,40,0.10),transparent_26%),linear-gradient(180deg,#f4f7fb_0%,#edf2f8_55%,#e6edf6_100%)] min-h-screen flex items-center">
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] flex items-center justify-center select-none">
        <div className="text-[42vw] md:text-[28vw] leading-none font-black font-logo text-[#0a1628] tracking-[-0.12em] translate-x-[3%]">
          X
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(10,22,40,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(10,22,40,0.05)_1px,transparent_1px)] [background-size:42px_42px] opacity-30" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-[#0a1628]/10 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0a1628] mb-6 shadow-sm">
          404 Hata
        </div>

        <h1 className="hero-title-modern text-4xl md:text-6xl lg:text-[82px] font-black font-logo text-secondary uppercase mb-5">
          Aradığınız sayfa bulunamadı
        </h1>

        <p className="text-base md:text-xl text-[#5c6b81] max-w-3xl mx-auto mb-10 leading-relaxed">
          İlgili içerik taşınmış, silinmiş veya bağlantı hatalı olabilir. Ana sayfaya ya da sektör ve modül sayfalarına geri dönebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="inline-flex items-center px-8 py-4 rounded-2xl bg-[#0a1628] text-white font-black hover:bg-[#dd222c] transition shadow-[0_18px_40px_rgba(10,22,40,0.20)]">
            Ana Sayfaya Dön
          </Link>

          <Link to="/sektorler" className="inline-flex items-center px-8 py-4 rounded-2xl bg-white/85 backdrop-blur-md border border-[#cfd9e6] text-secondary font-black hover:border-[#dd222c] hover:text-[#dd222c] transition shadow-sm">
            Sektörleri İncele
          </Link>
        </div>
      </div>
    </section>
  )
}
