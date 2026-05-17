import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCubes, faChevronDown, faIndustry, faStar, faCircleQuestion, faGears, faBox, faCar, faBolt, faStore, faBuilding, faGraduationCap, faMountain, faCalculator, faCartShopping, faIndustry as faIndustryAlt, faHandshake, faWarehouse, faUsers, faChartLine, faCheckDouble, faUserTie, faWallet, faGlobe, faCircleCheck, faTools, faHeadset, faShoppingBag, faCloud, faUserShield, faCoins, faBoxes, faShoppingCart, faBell, faCalendarDays, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { MODULES, SECTORS } from '@/lib/constants'
import api from '@/services/api'

// Icon mapping for modules
const moduleIcons: Record<string, typeof faCalculator> = {
  'fa-solid fa-calculator': faCalculator,
  'fa-solid fa-cart-shopping': faCartShopping,
  'fa-solid fa-industry': faIndustryAlt,
  'fa-solid fa-handshake': faHandshake,
  'fa-solid fa-warehouse': faWarehouse,
  'fa-solid fa-users': faUsers,
  'fa-solid fa-chart-line': faChartLine,
  'fa-solid fa-check-double': faCheckDouble,
  'fa-solid fa-user-tie': faUserTie,
  'fa-solid fa-wallet': faWallet,
  'fa-solid fa-globe': faGlobe,
  'fa-solid fa-check-circle': faCircleCheck,
  'fa-solid fa-tools': faTools,
  'fa-solid fa-headset': faHeadset,
  'fa-solid fa-shopping-bag': faShoppingBag,
  'fa-solid fa-cloud': faCloud,
  'fa-solid fa-user-shield': faUserShield,
  'fa-solid fa-coins': faCoins,
  'fa-solid fa-boxes': faBoxes,
  'fa-solid fa-shopping-cart': faShoppingCart,
}

interface HeaderProps {
  onDemoClick?: () => void
  hidden?: boolean
}

export default function Header({ onDemoClick, hidden = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModulesOpen, setIsModulesOpen] = useState(false)
  const [isSectorsOpen, setIsSectorsOpen] = useState(false)
  const [isBlogOpen, setIsBlogOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notificationCenter, setNotificationCenter] = useState<{ notifications_enabled: boolean; notifications_title: string; notification_items: Array<Record<string, any>> } | null>(null)
  const location = useLocation()

  const isHome = location.pathname === '/'

  useEffect(() => {
    api.get('/notifications')
      .then((response) => setNotificationCenter(response.data))
      .catch(() => setNotificationCenter(null))
  }, [])

  return (
    <nav className={`fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-0 transition-transform duration-300 ${hidden ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}>
      {/* Top Bar - Announcement */}
      <div className="w-full text-white border-b" style={{ backgroundColor: '#DC143C', borderColor: 'rgba(255,255,255,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-3 overflow-hidden py-2.5 md:py-3 text-[13px] md:text-[15px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] md:text-[12px] uppercase tracking-[0.16em] font-semibold flex-shrink-0" style={{ color: '#DC143C', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(255,255,255,0.3)' }}>
            <FontAwesomeIcon icon={faCubes} className="text-[9px] md:text-[10px]" />
            <span>Bu Modüller LIOX ERP'de</span>
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="announcement-marquee flex items-center gap-12 whitespace-nowrap">
              {[...MODULES, ...MODULES, ...MODULES].map((module, index) => (
                <button
                  key={`${module.id}-${index}`}
                  type="button"
                  onClick={() => document.getElementById('moduller')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  {module.icon && moduleIcons[module.icon] && (
                    <FontAwesomeIcon icon={moduleIcons[module.icon]} className="text-[12px] md:text-[13px] text-white/90" />
                  )}
                  <span className="text-[13px] md:text-[15px] leading-none">{module.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-3 py-2 md:py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 focus:outline-none">
          <img
            src="/assets/liox-logo.svg"
            alt="LIOX ERP Logo"
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Modüller Dropdown */}
          <div className="relative pb-4 -mb-4" onMouseEnter={() => setIsModulesOpen(true)} onMouseLeave={() => setIsModulesOpen(false)}>
            <Link to="/modul" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-uyumRed transition">
              Modüller
              <i className="fa-solid fa-chevron-down text-[10px]" />
            </Link>
            {isModulesOpen && (
              <div className="absolute top-full left-0 pt-2 w-[760px]">
                <div className="bg-white rounded-[1.75rem] border border-gray-200 shadow-2xl p-6">
                <div className="grid grid-cols-[1.4fr_1fr] gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Modül Kütüphanesi</div>
                        <div className="text-lg font-black text-secondary font-logo">Tüm ERP modülleri</div>
                      </div>
                      <Link to="/modul" className="text-[12px] font-bold text-uyumRed hover:text-secondary transition">
                        Tümünü Gör
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {MODULES.slice(0, 10).map((module) => (
                        <Link
                          key={module.id}
                          to={`/modul/${module.id}`}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition"
                        >
                          <div className="w-9 h-9 bg-uyumRed/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <i className={`${module.icon} text-xs text-uyumRed`} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{module.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-2">{module.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-gradient-to-br from-[#0a1628] to-[#0f2744] p-5 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 border border-white/10 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#dd222c]/20 rounded-full" />
                    <div className="space-y-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Öne Çıkan</div>
                      <div className="text-xl font-black font-logo leading-tight">İşletmenize uygun modül yapısını birlikte kurgulayalım</div>
                      <p className="text-sm text-white/80">Finans, üretim, kalite, depo ve satış süreçlerinize en uygun modülleri keşfedin.</p>
                    </div>
                    <Link to="/modul" className="mt-5 inline-flex items-center justify-center rounded-xl bg-white text-[#0a1628] px-4 py-3 text-sm font-black hover:bg-gray-100 transition relative z-10">
                      Modülleri İncele
                    </Link>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Blog Dropdown */}
          <div className="relative pb-4 -mb-4" onMouseEnter={() => setIsBlogOpen(true)} onMouseLeave={() => setIsBlogOpen(false)}>
            <Link
              to="/blog"
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-uyumRed transition"
            >
              Blog
            </Link>
            {isBlogOpen && (
              <div className="absolute top-full left-0 pt-2 w-[380px]">
                <div className="bg-white rounded-[1.75rem] border border-gray-200 shadow-2xl p-5">
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500 mb-1">Kategoriler</div>
                    <div className="text-lg font-black text-secondary font-logo">Blog Kategorileri</div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { title: 'ERP İpuçları', icon: 'fa-lightbulb', slug: 'erp-ipuclari', colorClass: 'bg-[#0a1628]/10 text-[#0a1628]' },
                      { title: 'Sektörel Çözümler', icon: 'fa-industry', slug: 'sektorel-cozumler', colorClass: 'bg-[#dd222c]/10 text-[#dd222c]' },
                      { title: 'Teknoloji', icon: 'fa-microchip', slug: 'teknoloji', colorClass: 'bg-purple-500/10 text-purple-500' },
                      { title: 'Başarı Hikayeleri', icon: 'fa-trophy', slug: 'basari-hikayeleri', colorClass: 'bg-emerald-500/10 text-emerald-500' },
                      { title: 'Eğitimler', icon: 'fa-graduation-cap', slug: 'egitimler', colorClass: 'bg-amber-500/10 text-amber-500' },
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/kategori/${cat.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.colorClass}`}>
                          <i className={`fa-solid ${cat.icon} text-xs`} />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to="/blog" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0a1628] text-white text-sm font-bold hover:bg-[#dd222c] transition">
                      Tüm Yazıları Gör
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sektörler Dropdown */}
          <div className="relative pb-4 -mb-4" onMouseEnter={() => setIsSectorsOpen(true)} onMouseLeave={() => setIsSectorsOpen(false)}>
            <Link
              to="/sektorler"
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-uyumRed transition"
            >
              Sektörler
              <i className="fa-solid fa-chevron-down text-[10px]" />
            </Link>
            {isSectorsOpen && (
              <div className="absolute top-full left-0 pt-2 w-[760px]">
                <div className="bg-white rounded-[1.75rem] border border-gray-200 shadow-2xl p-6">
                <div className="grid grid-cols-[1.4fr_1fr] gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Sektör Çözümleri</div>
                        <div className="text-lg font-black text-secondary font-logo">Sektörünüze özel kurgular</div>
                      </div>
                      <Link to="/sektorler" className="text-[12px] font-bold text-uyumRed hover:text-secondary transition">
                        Tümünü Gör
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {SECTORS.slice(0, 8).map((sector: typeof SECTORS[number]) => (
                        <Link
                          key={sector.id}
                          to={`/sektor/${sector.id}`}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition"
                        >
                          <div className="w-9 h-9 bg-uyumRed/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <i className={`${sector.icon} text-xs text-uyumRed`} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{sector.label}</div>
                            <div className="text-xs text-gray-500 line-clamp-2">{sector.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-gradient-to-br from-[#f8fafc] to-white border border-gray-200 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Sektörünüzü Seçin</div>
                      <div className="text-xl font-black font-logo text-secondary leading-tight">Üretimden hizmete tüm yapılar için hazır ERP kurguları</div>
                      <p className="text-sm text-gray-600">Makine metal, gıda, plastik, inşaat ve otomotiv dahil pek çok sektör için detay sayfalarına göz atın.</p>
                    </div>
                    <Link to="/sektorler" className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0a1628] text-white px-4 py-3 text-sm font-black hover:bg-[#dd222c] transition">
                      Sektörleri İncele
                    </Link>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Başarı Hikayeleri */}
          <Link
            to="/etkinlik"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-uyumRed transition"
          >
            Etkinlikler
          </Link>

          {/* Başarı Hikayeleri */}
          <Link
            to="/basari-hikayeleri"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-uyumRed transition"
          >
            Başarı Hikayeleri
          </Link>

          {/* Neden LIOX ERP */}
          <Link
            to="/neden-lioxerp"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-uyumRed transition"
          >
            Neden LIOX ERP
          </Link>
        </div>

        {/* CTA & Menu */}
        <div className="flex items-center gap-2">
          {notificationCenter?.notifications_enabled && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 hover:text-uyumRed hover:border-uyumRed/60 transition"
              >
                <FontAwesomeIcon icon={faBell} className="text-sm" />
                {(notificationCenter.notification_items || []).some((item) => item.is_unread) && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#dd222c]" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-3 w-[380px] rounded-[1.75rem] border border-gray-200 bg-white shadow-2xl overflow-hidden z-[90]">
                  <div className="px-5 py-4 border-b border-gray-100 bg-[#0a1628] text-white">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold">Bildirimler</div>
                    <div className="text-lg font-black font-logo">{notificationCenter.notifications_title || 'Bildirim Merkezi'}</div>
                  </div>
                  <div className="max-h-[520px] overflow-y-auto divide-y divide-gray-100">
                    {(notificationCenter.notification_items || []).map((item, index) => {
                      const icon = item.icon_class?.includes('calendar') ? faCalendarDays : item.icon_class?.includes('newspaper') ? faNewspaper : faBell
                      const colorClass = item.color === 'red'
                        ? 'bg-[#dd222c]/10 text-[#dd222c]'
                        : item.color === 'navy'
                          ? 'bg-[#0a1628]/10 text-[#0a1628]'
                          : item.color === 'green'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'

                      return (
                        <Link
                          key={`${item.title}-${index}`}
                          to={item.action_url || '#'}
                          onClick={() => setIsNotificationsOpen(false)}
                          className="flex gap-4 p-4 hover:bg-gray-50 transition"
                        >
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
                            <FontAwesomeIcon icon={icon} className="text-sm" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="text-sm font-black text-gray-900 leading-snug">{item.title}</div>
                              {item.is_unread ? <span className="mt-1 w-2 h-2 rounded-full bg-[#dd222c] shrink-0" /> : null}
                            </div>
                            <div className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</div>
                            <div className="flex items-center justify-between mt-3 text-[11px]">
                              <span className="text-gray-400 font-semibold">{item.date_label}</span>
                              <span className="text-[#dd222c] font-bold">{item.action_label || 'Detayı Aç'}</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              // Check current path and navigate to appropriate form
              const path = location.pathname
              if (path.startsWith('/sektor/') || path.startsWith('/modul/')) {
                // On sector or module page - scroll to form section
                const formSection = document.getElementById('form')
                if (formSection) {
                  formSection.scrollIntoView({ behavior: 'smooth' })
                } else {
                  // Fallback: scroll to bottom form on page
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                }
              } else if (path === '/') {
                // On home page - scroll to form area
                const formArea = document.getElementById('form-area')
                if (formArea) {
                  formArea.scrollIntoView({ behavior: 'smooth' })
                }
              } else {
                // On other pages - go to contact page which has a form
                window.location.href = '/iletisim'
              }
            }}
            className="rounded-lg font-black uppercase whitespace-nowrap px-4 md:px-5 py-2 text-[10px] md:text-[11px] tracking-[0.16em] md:tracking-[0.28em] shadow-lg transition-colors duration-200 cursor-pointer bg-[#0a1628] text-white hover:bg-[#dd222c]"
          >
            DEMO TALEP EDİN
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-uyumRed hover:border-uyumRed/60 transition"
          >
            <span className="flex flex-col gap-[3px] w-3.5">
              <span className={`h-[2px] rounded-full bg-current transition-transform duration-200 ${isMenuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`h-[2px] rounded-full bg-current transition-opacity duration-150 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`h-[2px] rounded-full bg-current transition-transform duration-200 ${isMenuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed z-[80] top-[60px] left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1">
              <Link
                to="/modul"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 text-sm font-semibold"
              >
                <i className="fa-solid fa-cubes text-[11px] text-gray-500" />
                <span>Modüller</span>
              </Link>
            <Link
              to="/sektorler"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 text-sm font-semibold"
            >
              <i className="fa-solid fa-industry text-[11px] text-gray-500" />
              <span>Sektörler</span>
            </Link>
            <Link
              to="/haber"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 text-sm font-semibold"
            >
              <i className="fa-solid fa-newspaper text-[11px] text-gray-500" />
              <span>Haberler</span>
            </Link>
            <Link
              to="/etkinlik"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 text-sm font-semibold"
            >
              <i className="fa-solid fa-calendar-days text-[11px] text-gray-500" />
              <span>Etkinlikler</span>
            </Link>
            <Link
              to="/basari-hikayeleri"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 text-sm font-semibold"
            >
              <i className="fa-solid fa-star text-[11px] text-gray-500" />
              <span>Başarı Hikayeleri</span>
            </Link>
            <Link
              to="/neden-lioxerp"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 transition flex items-center gap-2 text-sm font-semibold"
            >
              <i className="fa-solid fa-circle-question text-[11px] text-gray-500" />
              <span>Neden LIOX ERP</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
