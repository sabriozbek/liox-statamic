import { Link, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import api, { unwrapApiData } from '@/services/api'
import SeoManager from '@/components/seo/SeoManager'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  featured_image_alt: string
  author: string
  author_role: string
  publish_date: string
  reading_time: number
  category: {
    title: string
    slug: string
    color: string
  }
  custom_badge: string
  badge_color: string
}

interface Category {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  color: string
  featured_image: string
  seo_title: string
  seo_description: string
}

export default function BlogCategory() {
  const { slug } = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchCategoryData = async () => {
      try {
        // Fetch posts by category
        const postsRes = await api.get(`/blog/category/${slug}`)
        const postsData = unwrapApiData<any[]>(postsRes.data, [])
        
        if (postsData.length > 0) {
          const apiPosts = postsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || '',
            featured_image: p.featured_image || '',
            featured_image_alt: p.featured_image_alt || '',
            author: p.author || '',
            author_role: p.author_role || '',
            publish_date: p.publish_date || '',
            reading_time: p.reading_time || 0,
            category: p.category || null,
            custom_badge: p.custom_badge || '',
            badge_color: p.badge_color || 'red'
          })) as BlogPost[]
          
          setPosts(apiPosts)
        }
        
        // Fetch categories to get current category info
        const categoriesRes = await api.get('/blog/categories')
        const categoriesData = unwrapApiData<any[]>(categoriesRes.data, [])
        
        if (categoriesData.length > 0) {
          const catData = categoriesData.find((c: any) => c.slug === slug)
          if (catData) {
            const apiCategory: Category = {
              id: catData.id || slug,
              title: catData.title,
              slug: catData.slug,
              description: catData.description || '',
              icon: getCategoryIcon(catData.slug),
              color: catData.color || getCategoryColor(catData.slug),
              featured_image: '',
              seo_title: `${catData.title} | LIOX ERP Blog`,
              seo_description: catData.description || ''
            }
            setCategory(apiCategory)
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching category data:', error)
        setLoading(false)
      }
    }
    
    fetchCategoryData()
  }, [slug])

  const getCategoryIcon = (categorySlug: string): string => {
    const icons: Record<string, string> = {
      'erp-ipuclari': 'fa-lightbulb',
      'sektorel-cozumler': 'fa-industry',
      'teknoloji': 'fa-microchip',
      'basari-hikayeleri': 'fa-trophy',
      'egitimler': 'fa-graduation-cap',
    }
    return icons[categorySlug] || 'fa-folder'
  }

  const getCategoryColor = (categorySlug: string): string => {
    const colors: Record<string, string> = {
      'erp-ipuclari': 'blue',
      'sektorel-cozumler': 'red',
      'teknoloji': 'purple',
      'basari-hikayeleri': 'green',
      'egitimler': 'amber',
    }
    return colors[categorySlug] || 'blue'
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-[#dd222c]/10 text-[#dd222c] border-[#dd222c]/20',
      blue: 'bg-[#0a1628]/10 text-[#0a1628] border-[#0a1628]/20',
      green: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    }
    return colors[color] || colors.blue
  }

  const getBgColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      red: 'from-[#dd222c]/10 to-[#dd222c]/5',
      blue: 'from-[#0a1628]/10 to-[#0a1628]/5',
      green: 'from-emerald-500/10 to-emerald-500/5',
      purple: 'from-purple-500/10 to-purple-500/5',
      amber: 'from-amber-500/10 to-amber-500/5',
      cyan: 'from-cyan-500/10 to-cyan-500/5',
    }
    return colors[color] || colors.blue
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (loading || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0a1628]/20 border-t-[#dd222c] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Kategori yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoManager
        title={category?.seo_title || category?.title || 'LioXERP Blog'}
        description={category?.seo_description || category?.description || null}
      />

      {/* Hero */}
      <section className={`py-16 bg-gradient-to-br ${getBgColorClasses(category.color)}`}>
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-[11px] text-gray-500 mb-6">
            <Link to="/blog" className="hover:text-[#dd222c] transition">Blog</Link>
            <i className="fa-solid fa-chevron-right text-[8px]" />
            <span>{category.title}</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            {category.icon && (
              <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center ${getColorClasses(category.color)}`}>
                <i className={`fa-solid ${category.icon} text-2xl`} />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-logo uppercase text-[#0a1628]">
                {category.title}
              </h1>
            </div>
          </div>

          {category.description && (
            <p className="text-base text-gray-600 max-w-2xl">
              {category.description}
            </p>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-[#0a1628]">{posts.length}</span> yazı
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <i className="fa-solid fa-newspaper text-6xl text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bu kategoride henüz yazı yok</h3>
              <p className="text-sm text-gray-500">En kısa sürede içerik ekleniyor.</p>
              <Link to="/blog" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#0a1628] text-white text-sm font-bold hover:bg-[#dd222c] transition">
                Tüm Yazıları Gör
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {post.featured_image && (
                    <div className="relative aspect-video overflow-hidden">
                      <img src={post.featured_image} alt={post.featured_image_alt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {post.custom_badge && (
                        <span className="absolute top-4 left-4 inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dd222c] text-white">
                          {post.custom_badge}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClasses(post.category.color)}`}>
                      {post.category.title}
                    </span>
                    <h3 className="text-base font-black text-gray-900 font-logo leading-snug group-hover:text-[#dd222c] transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0a1628]/10 flex items-center justify-center text-[10px] font-bold text-[#0a1628]">
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-[11px] text-gray-600 font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span>{formatDate(post.publish_date)}</span>
                        <span>·</span>
                        <span>{post.reading_time} dk</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
