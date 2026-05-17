import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faEnvelope, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { MODULES, SECTORS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer id="site-footer" className="relative overflow-hidden py-10 md:py-12 border-t border-gray-100 bg-white">
      <div className="absolute inset-y-0 -right-[8vw] md:-right-[4vw] pointer-events-none opacity-[0.055] flex items-center justify-end select-none overflow-hidden">
        <div className="text-[62vw] md:text-[28vw] leading-none font-black font-logo text-[#0a1628] tracking-[-0.16em] scale-y-[1.04] translate-y-[2%]">
          X
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] items-start">
        {/* Company Info */}
        <div className="space-y-5">
          <Link to="/" className="inline-flex items-center focus:outline-none">
            <img src="/assets/liox-logo.svg" alt="LIOX ERP" className="h-10 md:h-12 w-auto" />
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">
            LIOX ERP, Uyumsoft tarafından geliştirilen, Türkiye'nin önde gelen yerli ERP çözümüdür. 
            29 yıllık sektör deneyimi ile işletmenizi dijitalleştiriyoruz.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-uyumRed hover:text-white text-gray-600 transition"
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="text-sm" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-uyumRed hover:text-white text-gray-600 transition"
            >
              <FontAwesomeIcon icon={faXTwitter} className="text-sm" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-uyumRed hover:text-white text-gray-600 transition"
            >
              <FontAwesomeIcon icon={faYoutube} className="text-sm" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Modüller */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900">Modüller</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/modul"
                  className="text-sm text-gray-600 hover:text-uyumRed transition flex items-center gap-1.5 font-semibold"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-uyumRed" />
                  Tüm Modüller
                </Link>
              </li>
              {MODULES.slice(0, 6).map((module) => (
                <li key={module.id}>
                  <Link
                    to={`/modul/${module.id}`}
                    className="text-sm text-gray-600 hover:text-uyumRed transition flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-uyumRed" />
                    {module.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sektörler */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900">Sektörler</h3>
            <ul className="space-y-2">
              {SECTORS.slice(0, 6).map((sector) => (
                <li key={sector.id}>
                  <Link
                    to={`/sektor/${sector.id}`}
                    className="text-sm text-gray-600 hover:text-uyumRed transition flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-uyumRed" />
                    {sector.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-900">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <FontAwesomeIcon icon={faLocationDot} className="text-uyumRed mt-0.5" />
                <span>
                  Çiftehavuzlar Mah. Eski Londra Asfaltı Cad.<br />
                  Yıldız Teknik Üniversitesi Davutpaşa Kampüsü Teknoparkı<br />
                  A1 Blok – Kat:2 – No:201<br />
                  P.K. 34220 Esenler / İstanbul / TÜRKİYE
                </span>
              </li>
              <li>
                <a href="tel:+902124673333" className="flex items-center gap-2 text-sm text-gray-600 hover:text-uyumRed transition">
                  <FontAwesomeIcon icon={faPhone} className="text-uyumRed" />
                  <span>+90 (212) 467 33 33</span>
                </a>
              </li>
              <li>
                <a href="mailto:uyumsoft@uyumsoft.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-uyumRed transition">
                  <FontAwesomeIcon icon={faEnvelope} className="text-uyumRed" />
                  <span>uyumsoft@uyumsoft.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-6 mt-6 border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Uyumsoft Bilgi Teknoloileri. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/gizlilik-politikasi" className="text-xs text-gray-500 hover:text-uyumRed transition">
              Gizlilik Politikası
            </Link>
            <Link to="/kullanim-sartlari" className="text-xs text-gray-500 hover:text-uyumRed transition">
              Kullanım Şartları
            </Link>
            <Link to="/kvkk" className="text-xs text-gray-500 hover:text-uyumRed transition">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
