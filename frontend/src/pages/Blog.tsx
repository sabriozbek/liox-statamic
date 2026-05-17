import { Link, useSearchParams } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { listenForBlogPopup } from '@/lib/PopupContext'
import api from '@/services/api'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  featured_image: string
  featured_image_alt: string
  author: string
  author_role: string
  author_avatar: string
  author_bio: string
  publish_date: string
  reading_time: number
  category: {
    title: string
    slug: string
    color: string
  }
  tags: Array<{ title: string; slug: string }>
  is_featured: boolean
  is_pinned: boolean
  show_in_intro: boolean
  show_in_intro_right: boolean
  custom_badge: string
  badge_color: string
  views?: number
}

interface Category {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  color: string
  featured_image: string
  post_count?: number
}

interface Tag {
  id: string
  title: string
  slug: string
  count?: number
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [pinnedPosts, setPinnedPosts] = useState<BlogPost[]>([])
  const [popularSliderIndex, setPopularSliderIndex] = useState(0)
  const popularSliderRef = useRef<HTMLDivElement>(null)
  const [sidebarSticky, setSidebarSticky] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          api.get('/blog'),
          api.get('/blog/categories'),
          api.get('/blog/tags'),
        ])

        const postsData = postsRes.data
        const categoriesData = categoriesRes.data
        const tagsData = tagsRes.data

        if (postsData.data && postsData.data.length > 0) {
          const apiPosts = postsData.data.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            featured_image: post.featured_image || '',
            featured_image_alt: post.featured_image_alt || '',
            author: post.author || '',
            author_role: post.author_role || '',
            author_avatar: post.author_avatar || '',
            author_bio: post.author_bio || '',
            publish_date: post.publish_date || '',
            reading_time: post.reading_time || 0,
            category: post.category || { title: 'Kategorisiz', slug: '', color: 'blue' },
            tags: post.tags || [],
            is_featured: post.is_featured || false,
            is_pinned: post.is_pinned || false,
            show_in_intro: post.show_in_intro || false,
            show_in_intro_right: post.show_in_intro_right || false,
            custom_badge: post.custom_badge || '',
            badge_color: post.badge_color || 'red',
            views: post.views || 0,
          })) as BlogPost[]
          
          setPosts(apiPosts)
          
          // Featured posts
          const featured = apiPosts.filter(p => p.show_in_intro)
          setFeaturedPosts(featured)
          
          // Pinned posts
          const pinned = apiPosts.filter(p => p.is_pinned)
          setPinnedPosts(pinned)
        }

        if (categoriesData.data && categoriesData.data.length > 0) {
          const apiCategories = categoriesData.data.map((cat: any, index: number) => ({
            id: cat.id || (index + 1).toString(),
            title: cat.title,
            slug: cat.slug,
            description: cat.description || '',
            icon: getCategoryIcon(cat.slug),
            color: getCategoryColor(cat.slug),
            featured_image: '',
            post_count: cat.post_count || 0,
          })) as Category[]
          
          setCategories(apiCategories)
        }

        if (tagsData.data && tagsData.data.length > 0) {
          setTags(tagsData.data)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching blog data:', error)
        setLoading(false)
      }
    }
    
    fetchBlogData()
  }, [])

  const getCategoryIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'erp-ipuclari': 'fa-lightbulb',
      'sektorel-cozumler': 'fa-industry',
      'teknoloji': 'fa-microchip',
      'basari-hikayeleri': 'fa-trophy',
      'egitimler': 'fa-graduation-cap',
    }
    return icons[slug] || 'fa-folder'
  }

  const getCategoryColor = (slug: string): string => {
    const colors: Record<string, string> = {
      'erp-ipuclari': 'blue',
      'sektorel-cozumler': 'red',
      'teknoloji': 'purple',
      'basari-hikayeleri': 'green',
      'egitimler': 'amber',
    }
    return colors[slug] || 'blue'
  }

  // Sidebar sticky scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect()
        setSidebarSticky(rect.top < 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for popup triggers
  useEffect(() => {
    const cleanup = listenForBlogPopup(() => {
      // Popup will be handled by PopupWidget
    })
    return cleanup
  }, [])

  const filteredPosts = posts.filter(post => {
    if (selectedCategory && post.category?.slug !== selectedCategory) return false
    if (selectedTag && !post.tags.some(t => t.slug === selectedTag)) return false
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) && !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const allTags = tags.length > 0 ? tags : [...new Set(posts.flatMap(p => p.tags.map(t => t)))]
  const tagCounts = tags.length > 0
    ? tags.reduce((acc, tag) => {
        acc[tag.slug] = tag.count || 0
        return acc
      }, {} as Record<string, number>)
    : posts.reduce((acc, post) => {
        post.tags.forEach(tag => {
          acc[tag.slug] = (acc[tag.slug] || 0) + 1
        })
        return acc
      }, {} as Record<string, number>)

  const popularPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatViews = (views: number = 0) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K'
    }
    return views.toString()
  }

  const handlePrevPopular = () => {
    setPopularSliderIndex(prev => prev === 0 ? popularPosts.length - 1 : prev - 1)
  }

  const handleNextPopular = () => {
    setPopularSliderIndex(prev => prev === popularPosts.length - 1 ? 0 : prev + 1)
  }

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(selectedCategory === slug ? null : slug)
  }

  const handleTagClick = (slug: string) => {
    setSelectedTag(selectedTag === slug ? null : slug)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0a1628]/20 border-t-[#dd222c] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Blog yazıları yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#0a1628]/5 text-[#0a1628] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <i className="fa-solid fa-blog text-[#dd222c]" />
              Blog
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-logo uppercase text-[#0a1628]">
              LIOX ERP Blog
            </h1>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-4">
              ERP sistemleri, sektörel çözümler, teknoloji trendleri ve müşteri başarı hikayeleri hakkında güncel içerikler.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Blog yazısı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-[#0a1628] transition"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts with Slider */}
      {featuredPosts.length > 0 && !selectedCategory && !selectedTag && !searchQuery && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dd222c]/10 flex items-center justify-center">
                  <i className="fa-solid fa-star text-[#dd222c]" />
                </div>
                <h2 className="text-lg font-black text-[#0a1628] font-logo">Öne Çıkan Yazılar</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPopular}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition"
                >
                  <i className="fa-solid fa-chevron-left text-xs" />
                </button>
                <button
                  onClick={handleNextPopular}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition"
                >
                  <i className="fa-solid fa-chevron-right text-xs" />
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl">
              <div 
                ref={popularSliderRef}
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${popularSliderIndex * 100}%)` }}
              >
                {featuredPosts.map((post) => (
                  <div key={post.id} className="w-full flex-shrink-0">
                    <Link to={`/blog/${post.slug}`} className="group block">
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0f2744]">
                        <div className="absolute inset-0">
                          {post.featured_image && (
                            <img src={post.featured_image} alt={post.featured_image_alt || post.title} className="w-full h-full object-cover opacity-30" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/80 to-transparent" />
                        </div>
                        <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-10">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClasses(post.category.color)}`}>
                                {post.category.title}
                              </span>
                              {post.custom_badge && (
                                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dd222c] text-white">
                                  {post.custom_badge}
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white font-logo leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-sm text-white/80 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 pt-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                  {post.author.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-white">{post.author}</div>
                                  <div className="text-xs text-white/60">{post.author_role}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:block">
                            {post.featured_image && (
                              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                <img src={post.featured_image} alt={post.featured_image_alt || post.title} className="w-full aspect-video object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Slider indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {featuredPosts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPopularSliderIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === popularSliderIndex ? 'w-6 bg-[#dd222c]' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            {/* Posts */}
            <div>
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  {selectedCategory && (
                    <span className="text-gray-500">Filtre:</span>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a1628] text-white text-xs font-semibold"
                    >
                      {categories.find(c => c.slug === selectedCategory)?.title}
                      <i className="fa-solid fa-times text-[10px]" />
                    </button>
                  )}
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dd222c] text-white text-xs font-semibold"
                    >
                      #{tags.find(t => t.slug === selectedTag)?.title}
                      <i className="fa-solid fa-times text-[10px]" />
                    </button>
                  )}
                  {(selectedCategory || selectedTag) && (
                    <button
                      onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}
                      className="text-xs text-gray-500 hover:text-[#dd222c] transition"
                    >
                      Temizle
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#0a1628] text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                  >
                    <i className="fa-solid fa-grid-2 text-sm" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[#0a1628] text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                  >
                    <i className="fa-solid fa-list text-sm" />
                  </button>
                </div>
              </div>

              {/* Posts Grid/List */}
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                  <i className="fa-solid fa-newspaper text-6xl text-gray-200 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Sonuç bulunamadı</h3>
                  <p className="text-sm text-gray-500">Arama kriterlerinize uygun blog yazısı bulunamadı.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
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
                            <i className="fa-solid fa-eye text-[8px]" />
                            <span>{formatViews(post.views)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="flex">
                        {post.featured_image && (
                          <div className="w-48 md:w-64 flex-shrink-0">
                            <img src={post.featured_image} alt={post.featured_image_alt || post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1 p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClasses(post.category.color)}`}>
                              {post.category.title}
                            </span>
                            {post.custom_badge && (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dd222c] text-white">
                                {post.custom_badge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-gray-900 font-logo leading-snug group-hover:text-[#dd222c] transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#0a1628]/10 flex items-center justify-center text-[10px] font-bold text-[#0a1628]">
                                {post.author.charAt(0)}
                              </div>
                              <span className="text-[11px] text-gray-600 font-medium">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                              <span>{formatDate(post.publish_date)}</span>
                              <span>·</span>
                              <span>{post.reading_time} dk</span>
                              <span>·</span>
                              <span><i className="fa-solid fa-eye text-[8px] mr-1" />{formatViews(post.views)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Sticky */}
            <div ref={sidebarRef} className={`transition-all duration-300 ${sidebarSticky ? 'lg:sticky lg:top-24' : ''}`}>
              <div className="space-y-6">
                {/* Popular Posts */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#dd222c]/10 flex items-center justify-center">
                      <i className="fa-solid fa-fire text-[#dd222c] text-sm" />
                    </div>
                    <h3 className="text-sm font-black text-[#0a1628] uppercase tracking-wider">Popüler Yazılar</h3>
                  </div>
                  <div className="space-y-4">
                    {popularPosts.slice(0, 5).map((post, index) => (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="group flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0a1628]/5 flex items-center justify-center text-[#0a1628] font-black text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-gray-900 leading-snug group-hover:text-[#dd222c] transition line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                            <i className="fa-solid fa-eye text-[8px]" />
                            <span>{formatViews(post.views)} görüntülenme</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6">
                  <h3 className="text-sm font-black text-[#0a1628] uppercase tracking-wider mb-4">Kategoriler</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                        !selectedCategory ? 'bg-[#0a1628] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Tümü</span>
                      <span className="text-[10px] opacity-60">{posts.length}</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                          selectedCategory === cat.slug ? 'bg-[#0a1628] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {cat.icon && <i className={`fa-solid ${cat.icon} text-xs ${selectedCategory === cat.slug ? 'text-white/80' : 'text-gray-400'}`} />}
                          <span>{cat.title}</span>
                        </div>
                        <span className={`text-[10px] ${selectedCategory === cat.slug ? 'text-white/60' : 'text-gray-400'}`}>{cat.post_count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6">
                  <h3 className="text-sm font-black text-[#0a1628] uppercase tracking-wider mb-4">Popüler Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([slug, count]) => {
                      const tag = allTags.find(t => t.slug === slug)
                      if (!tag) return null
                      return (
                        <button
                          key={slug}
                          onClick={() => handleTagClick(slug)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition ${
                            selectedTag === slug
                              ? 'bg-[#dd222c] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          #{tag.title}
                          <span className="opacity-60">{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-3xl p-6 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <i className="fa-solid fa-envelope text-xl" />
                  </div>
                  <h3 className="text-lg font-black font-logo mb-2">Bültene Katıl</h3>
                  <p className="text-xs text-white/70 mb-4">Yeni blog yazılarından haberdar olun.</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40 transition"
                    />
                    <button className="w-full px-4 py-3 rounded-xl bg-[#dd222c] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#c41e2a] transition">
                      Abone Ol
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-[#dd222c] rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-black font-logo mb-2">Demo Talep Et</h3>
                  <p className="text-xs text-white/80 mb-4">LIOX ERP'yi kendi gözlerinizle görün.</p>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('open-demo-popup'))} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#dd222c] text-sm font-bold hover:bg-gray-100 transition">
                    Hemen Başla
                    <i className="fa-solid fa-arrow-right text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'LIOX ERP Blog',
            description: 'ERP sistemleri, sektörel çözümler ve teknoloji trendleri hakkında güncel içerikler.',
            url: window.location.origin + '/blog',
            publisher: {
              '@type': 'Organization',
              name: 'LIOX ERP',
              logo: {
                '@type': 'ImageObject',
                url: window.location.origin + '/assets/logo.png'
              }
            }
          })
        }}
      />
    </div>
  )
}
