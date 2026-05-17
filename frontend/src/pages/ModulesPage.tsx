import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import api, { unwrapApiData } from '@/services/api'

interface ModuleListItem {
  slug: string
  title: string
  short_description: string
  icon?: string
  hero_visual_url?: string
  features?: Array<{ title: string; description: string }>
}

// Module-specific images from Unsplash
const MODULE_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1551288049-bebda4e02f9c?w=800&h=400&fit=crop',
  'finans': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
  'uretim': 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&h=400&fit=crop',
  'kalite': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
  'depo': 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=400&fit=crop',
  'bakim': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop',
  'satis': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  'crm': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=ccrop',
  'ihracat': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=400&fit=crop',
  ' servis': 'https://images.unsplash.com/photo-1585771724684-38269d1639b0?w=800&h=400&fit=crop',
}

export default function ModulesPage() {
  const [items, setItems] = useState<ModuleListItem[]>([])

  useEffect(() => {
    api.get<ModuleListItem[]>('/modules')
      .then((response) => setItems(unwrapApiData<ModuleListItem[]>(response.data, [])))
      .catch(() => setItems([]))
  }, [])

  // Get image for module or use fallback
  const getModuleImage = (slug: string, customImage?: string) => {
    if (customImage) return customImage
    
    const lowerSlug = slug.toLowerCase()
    for (const [key, url] of Object.entries(MODULE_IMAGES)) {
      if (lowerSlug.includes(key)) {
        return url
      }
    }
    return MODULE_IMAGES['default']
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
            {['Uçtan Uca Süreçler', 'Operasyonel Verimlilik', 'Sektöre Uyumlu'].map((badge, index) => (
              <span key={index} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] md:text-xs uppercase tracking-[0.2em] font-semibold">
                {badge}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-logo uppercase mb-5">
            Modüller
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">
            LIOX ERP modüllerini tek tek inceleyin. Finans, üretim, kalite, depo, bakım ve satış süreçlerinize özel çözümleri keşfedin.
          </p>
        </div>
      </section>

      {/* Modules Grid with Images */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link 
                key={item.slug} 
                to={`/modul/${item.slug}`} 
                className="group rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0f2744]">
                  <img 
                    src={getModuleImage(item.slug, item.hero_visual_url)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <i className={item.icon || 'fa-solid fa-cube'} />
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#dd222c] transition-colors">
                    <i className="fa-solid fa-arrow-right text-white text-sm" />
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-black text-gray-900 font-logo group-hover:text-[#0a1628] transition-colors">{item.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.short_description}</p>
                  
                  {/* Features */}
                  {item.features && item.features.length > 0 && (
                    <div className="space-y-2">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-5 h-5 rounded bg-[#0a1628]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i className="fa-solid fa-check text-[#0a1628] text-[10px]" />
                          </div>
                          <span className="line-clamp-1">{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#dd222c] group-hover:text-[#b81c29] transition-colors">Modülü İncele</span>
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
