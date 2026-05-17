import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import api, { unwrapApiData } from '@/services/api'

interface LandingPageContent {
  sectors_landing_baslik?: string
  sectors_landing_aciklama?: string
  sectors_landing_badges?: string[]
  sectors_landing_image?: string
}

interface SectorListItem {
  slug: string
  title: string
  description: string
  hero_visual?: string
  metrics?: Array<{ label: string; value: string; suffix?: string; prefix?: string }>
}

// Sector-specific images from Unsplash
const SECTOR_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
  'gida': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
  'inşaat': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop',
  'makine': 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=400&fit=crop',
  'metal': 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=400&fit=crop',
  'otomotiv': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop',
  'plastik': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
  'ambalaj': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
  'tekstil': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=400&fit=crop',
  'ilac': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
  'kimya': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
  'elektronik': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
  'mobilya': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop',
  'hizmet': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
}

export default function SectorsPage() {
  const [items, setItems] = useState<SectorListItem[]>([])
  const [pageContent, setPageContent] = useState<LandingPageContent | null>(null)

  useEffect(() => {
    api.get<SectorListItem[]>('/sectors')
      .then((response) => setItems(unwrapApiData<SectorListItem[]>(response.data, [])))
      .catch(() => setItems([]))

    api.get<LandingPageContent>('/page/sektorler')
      .then((response) => setPageContent(unwrapApiData<LandingPageContent | null>(response.data, null)))
      .catch(() => setPageContent(null))
  }, [])

  // Get image for sector or use fallback
  const getSectorImage = (slug: string, customImage?: string) => {
    if (customImage) return customImage
    
    const lowerSlug = slug.toLowerCase()
    for (const [key, url] of Object.entries(SECTOR_IMAGES)) {
      if (lowerSlug.includes(key)) {
        return url
      }
    }
    return SECTOR_IMAGES['default']
  }

  return (
    <>
      {/* Hero Section - Dark Navy with Shapes */}
      <section className="bg-[#0a1628] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#dd222c]/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#dd222c] rounded-full animate-pulse-slow opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white/5 rounded-full" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {(pageContent?.sectors_landing_badges || ['Üretim Odaklı', 'Sektöre Özel', 'Uçtan Uca Entegrasyon']).map((badge, index) => (
              <span key={index} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] md:text-xs uppercase tracking-[0.2em] font-semibold">
                {badge}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-logo uppercase mb-5">
            {pageContent?.sectors_landing_baslik || 'Sektörünüze Özel ERP Çözümleri'}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">
            {pageContent?.sectors_landing_aciklama || 'LIOX ERP\'nin sektörünüze özel çözümlerini inceleyin ve iş yapınıza en uygun yapıyı keşfedin.'}
          </p>
        </div>
      </section>

      {/* Sectors Grid with Images */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link 
                key={item.slug} 
                to={`/sektor/${item.slug}`} 
                className="group rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0f2744]">
                  <img 
                    src={getSectorImage(item.slug, item.hero_visual)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/30 to-transparent" />
                  
                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <h2 className="text-2xl font-black text-white font-logo drop-shadow-lg">{item.title}</h2>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#dd222c] transition-colors">
                    <i className="fa-solid fa-arrow-right text-white text-sm" />
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                  
                  {/* Metrics */}
                  {item.metrics && item.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {item.metrics.slice(0, 3).map((metric, idx) => (
                        <div key={idx} className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                          <div className="text-lg font-black text-[#0a1628]">{metric.prefix}{metric.value}{metric.suffix}</div>
                          <div className="text-[10px] text-gray-500 mt-1">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#dd222c] group-hover:text-[#b81c29] transition-colors">Detayları İncele</span>
                    <i className="fa-solid fa-arrow-right text-[#dd222c] text-sm group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
