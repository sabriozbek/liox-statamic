import { Link, useParams, useNavigate } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import LeadForm from '@/components/forms/LeadForm'
import { listenForBlogPopup } from '@/lib/PopupContext'
import api from '@/services/api'
import { getCtaVariantsFromSettings } from '@/lib/siteSettings'

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
  updated_date: string
  reading_time: number
  category: {
    title: string
    slug: string
    color: string
  }
  tags: Array<{ title: string; slug: string }>
  is_featured: boolean
  is_pinned: boolean
  custom_badge: string
  badge_color: string
  template: string
  form_title: string
  form_description: string
  form_variant: string
  video_url: string
  video_autoplay: boolean
  enable_reading_progress: boolean
  enable_sticky_share: boolean
  show_share_buttons: boolean
  show_author_box: boolean
  show_related_posts: boolean
  related_posts_count: number
  schema_type: string
  og_image: string
  no_index: boolean
}

export default function BlogPost() {
  const ctaVariants = getCtaVariantsFromSettings()
  const compactVariant = (ctaVariants as Record<string, any> | null)?.['4'] || null
  const { slug } = useParams()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [showShareButtons, setShowShareButtons] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    const fetchPostData = async () => {
      try {
        // Fetch blog post by slug
        const postRes = await api.get(`/blog/${slug}`)
        const postData = postRes.data
        
        if (postData.data) {
          const apiPost = {
            id: postData.data.id,
            title: postData.data.title,
            slug: postData.data.slug,
            excerpt: postData.data.excerpt || '',
            content: postData.data.content,
            featured_image: postData.data.featured_image || '',
            featured_image_alt: postData.data.featured_image_alt || '',
            author: postData.data.author || '',
            author_role: postData.data.author_role || '',
            author_avatar: '',
            author_bio: postData.data.author_bio || '',
            publish_date: postData.data.publish_date || '',
            updated_date: '',
            reading_time: postData.data.reading_time || 0,
            category: postData.data.category || null,
            tags: postData.data.tags || [],
            is_featured: postData.data.is_featured || false,
            is_pinned: postData.data.is_pinned || false,
            custom_badge: postData.data.custom_badge || '',
            badge_color: postData.data.badge_color || 'red',
            template: postData.data.template || 'standard',
            form_title: postData.data.form_title || '',
            form_description: postData.data.form_description || '',
            form_variant: 'compact',
            video_url: '',
            video_autoplay: false,
            enable_reading_progress: postData.data.enable_reading_progress ?? true,
            enable_sticky_share: false,
            show_share_buttons: postData.data.show_share_buttons ?? true,
            show_author_box: postData.data.show_author_box ?? true,
            show_related_posts: postData.data.show_related_posts ?? true,
            related_posts_count: 3,
            schema_type: 'article',
            og_image: '',
            no_index: false
          } as BlogPost
          
          setPost(apiPost)
        }
        
        // Fetch related posts
        const relatedRes = await api.get(`/blog/related/${slug}`)
        const relatedData = relatedRes.data
        
        if (relatedData.data && relatedData.data.length > 0) {
          const apiRelated = relatedData.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || '',
            content: null,
            featured_image: p.featured_image || '',
            featured_image_alt: p.featured_image_alt || '',
            author: p.author || '',
            author_role: p.author_role || '',
            author_avatar: '',
            author_bio: '',
            publish_date: p.publish_date || '',
            updated_date: '',
            reading_time: p.reading_time || 0,
            category: p.category || null,
            tags: p.tags || [],
            is_featured: p.is_featured || false,
            is_pinned: p.is_pinned || false,
            custom_badge: p.custom_badge || '',
            badge_color: p.badge_color || 'red',
            template: 'standard',
            form_title: '',
            form_description: '',
            form_variant: 'compact',
            video_url: '',
            video_autoplay: false,
            enable_reading_progress: true,
            enable_sticky_share: false,
            show_share_buttons: true,
            show_author_box: true,
            show_related_posts: true,
            related_posts_count: 3,
            schema_type: 'article',
            og_image: '',
            no_index: false
          })) as BlogPost[]
          
          setRelatedPosts(apiRelated)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setLoading(false)
      }
    }
    
    fetchPostData()
  }, [slug])

  useEffect(() => {
    if (!slug) return

    const sessionKey = `blog_viewed_${slug}`
    if (window.sessionStorage.getItem(sessionKey)) return

    api.post(`/blog/${slug}/view`)
      .then(() => {
        window.sessionStorage.setItem(sessionKey, '1')
      })
      .catch((error) => {
        console.error('Error incrementing blog view:', error)
      })
  }, [slug])

  // Listen for popup triggers
  useEffect(() => {
    const cleanup = listenForBlogPopup(() => {
      // Popup will be handled by PopupWidget
    })
    return cleanup
  }, [])

  // Reading progress
  useEffect(() => {
    if (!post?.enable_reading_progress) return

    const handleScroll = () => {
      if (!contentRef.current) return
      const element = contentRef.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top + window.scrollY
      const elementHeight = element.offsetHeight
      const scrolled = window.scrollY - elementTop + windowHeight * 0.3
      const progress = Math.min(Math.max((scrolled / elementHeight) * 100, 0), 100)
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [post?.enable_reading_progress])

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post?.title || ''

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      copy: ''
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl)
      alert('Link kopyalandı!')
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  if (loading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0a1628]/20 border-t-[#dd222c] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Render content based on template
  const renderContent = () => {
    return (
      <div 
        ref={contentRef}
        className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-[#0a1628] prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-[#dd222c] prose-strong:text-gray-900"
      >
        <h2>Üretim Süreçlerinde Verimlilik</h2>
        <p>Modern üretim tesislerinde, süreç optimizasyonu rekabet avantajının anahtarıdır. LIOX ERP, üretim planlamasından kalite kontrolüne kadar tüm süreçleri tek bir platformda birleştirir.</p>
        
        <h2>Ana Modüller</h2>
        <ul>
          <li><strong>Üretim Yönetimi</strong> - İş emirleri, rota yönetimi ve kapasite planlaması</li>
          <li><strong>Kalite Kontrol</strong> - Fire oranları, muayene noktaları ve sertifikasyon</li>
          <li><strong>Depo Yönetimi</strong> - Lot/seri takibi, barkod sistemleri ve lokasyon yönetimi</li>
          <li><strong>Bakım Yönetimi</strong> - Prediktif bakım ve arıza yönetimi</li>
        </ul>
        
        <h2>Gerçek Zamanlı Takip</h2>
        <p>LIOX ERP'nin gerçek zamanlı dashboard'ları sayesinde, üretim hattınızdaki her anlık değişikliği anında görürsünüz. Puant üretim, makine duruşları ve fire oranları tek bir ekranda.</p>
        
        <blockquote>
          <p>"LIOX ERP ile üretim verimliliğimiz %40 arttı. Artık tüm süreçleri tek bir sistemden takip ediyoruz." — ABC Makina Genel Müdürü</p>
        </blockquote>
        
        <h2>Sonuç</h2>
        <p>Üretim süreçlerinizi optimize etmek, rekabet avantajı elde etmenin en etkili yoludur. LIOX ERP, bu süreçte size kapsamlı araçlar sunar. Demo talep ederek sistemin kendi gözlerinizle nasıl çalıştığını görebilirsiniz.</p>
      </div>
    )
  }

  const renderSidebar = () => (
    <aside className="space-y-6">
      {/* Table of Contents */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-24">
        <h3 className="text-sm font-black text-[#0a1628] uppercase tracking-wider mb-4">İçindekiler</h3>
        <nav className="space-y-2 text-sm">
          <a href="#content" className="flex items-center gap-2 text-gray-600 hover:text-[#dd222c] transition">
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-400" />
            Üretim Süreçlerinde Verimlilik
          </a>
          <a href="#content" className="flex items-center gap-2 text-gray-600 hover:text-[#dd222c] transition">
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-400" />
            Ana Modüller
          </a>
          <a href="#content" className="flex items-center gap-2 text-gray-600 hover:text-[#dd222c] transition">
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-400" />
            Gerçek Zamanlı Takip
          </a>
          <a href="#content" className="flex items-center gap-2 text-gray-600 hover:text-[#dd222c] transition">
            <i className="fa-solid fa-chevron-right text-[10px] text-gray-400" />
            Sonuç
          </a>
        </nav>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-3xl p-6 text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
          <i className="fa-solid fa-rocket text-xl" />
        </div>
        <h3 className="text-lg font-black font-logo mb-2">Demo Talep Et</h3>
        <p className="text-xs text-white/70 mb-4">LIOX ERP'yi kendi üretim süreçlerinizde deneyin.</p>
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-demo-popup'))} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#dd222c] text-white text-sm font-bold hover:bg-[#c41e2a] transition w-full justify-center">
          Hemen Başla
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-white -mt-[60px] pt-[60px]">
      {/* Reading Progress Bar */}
      {post.enable_reading_progress && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[#dd222c] z-50">
          <div
            className="h-full bg-[#0a1628] transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 bg-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-white/60 mb-6">
            <Link to="/blog" className="hover:text-white transition">Blog</Link>
            <i className="fa-solid fa-chevron-right text-[8px]" />
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClasses(post.category.color)}`}>
              {post.category.title}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black font-logo leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{post.author}</div>
                <div className="text-xs text-white/60">{post.author_role}</div>
              </div>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="text-white/80">
              <span>{formatDate(post.publish_date)}</span>
              {post.updated_date && (
                <span className="text-white/50 ml-2">· Güncelleme: {formatDate(post.updated_date)}</span>
              )}
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-1 text-white/80">
              <i className="fa-solid fa-clock text-xs" />
              <span>{post.reading_time} dk okuma</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image && post.template !== 'minimal' && (
        <div className="relative">
          <img 
            src={post.featured_image} 
            alt={post.featured_image_alt || post.title} 
            className={`w-full object-cover ${post.template === 'video_header' ? 'h-[50vh] md:h-[60vh]' : 'h-[40vh] md:h-[50vh]'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Video Header Template */}
      {post.template === 'video_header' && post.video_url && (
        <div className="aspect-video bg-[#0a1628]">
          <iframe 
            src={post.video_url} 
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      <section id="content" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className={post.template === 'with_sidebar' ? 'grid lg:grid-cols-[1fr_300px] gap-10' : ''}>
            {/* Main Content */}
            <div className={post.template === 'with_sidebar' ? '' : 'max-w-3xl mx-auto'}>
              {post.template === 'with_form' ? (
                <div className="grid md:grid-cols-[1fr_400px] gap-10">
                  <div className="bg-gray-50 rounded-3xl p-8">
                    {renderContent()}
                  </div>
                  <div className="space-y-6">
                      <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-3xl p-6 text-white">
                        <h3 className="text-lg font-black font-logo mb-2">{post.form_title || compactVariant?.formTitle || 'Demo Talep Formu'}</h3>
                        <p className="text-xs text-white/70 mb-4">{post.form_description || compactVariant?.formSubtitle || 'Bu konuda daha fazla bilgi almak için formu doldurun.'}</p>
                        <button
                          onClick={() => window.dispatchEvent(new CustomEvent('open-demo-popup'))}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#dd222c] text-white text-sm font-bold hover:bg-[#c41e2a] transition"
                        >
                          {compactVariant?.submitLabel || 'Demo Talep Et'}
                          <i className="fa-solid fa-arrow-right text-xs" />
                        </button>
                      </div>
                  </div>
                </div>
              ) : post.template === 'video_header' ? (
                <div className="space-y-8">
                  {renderContent()}
                  
                  {/* Video embed */}
                  {post.video_url && (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                      <iframe 
                        src={post.video_url} 
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              ) : post.template === 'magazine' ? (
                <div className="space-y-10">
                  <div className="text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClasses(post.category.color)}`}>
                      {post.category.title}
                    </span>
                  </div>
                  {renderContent()}
                </div>
              ) : (
                renderContent()
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag.slug}
                      to={`/blog?tag=${tag.slug}`}
                      className="inline-flex px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition"
                    >
                      #{tag.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              {post.show_share_buttons && (
                <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Paylaş:</span>
                  <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition flex items-center justify-center">
                    <i className="fa-brands fa-x-twitter text-sm" />
                  </button>
                  <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-[#1877F2] hover:text-white transition flex items-center justify-center">
                    <i className="fa-brands fa-facebook-f text-sm" />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-[#0A66C2] hover:text-white transition flex items-center justify-center">
                    <i className="fa-brands fa-linkedin-in text-sm" />
                  </button>
                  <button onClick={() => handleShare('copy')} className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-700 hover:text-white transition flex items-center justify-center">
                    <i className="fa-solid fa-link text-sm" />
                  </button>
                </div>
              )}

              {/* Author Box */}
              {post.show_author_box && (
                <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0f2744] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">Yazar</div>
                      <h4 className="text-lg font-black text-[#0a1628]">{post.author}</h4>
                      <div className="text-xs text-gray-500 mb-2">{post.author_role}</div>
                      {post.author_bio && (
                        <p className="text-sm text-gray-600">{post.author_bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {post.template === 'with_sidebar' && (
              <aside className="space-y-6">
                <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2744] rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-black font-logo mb-2">Demo Talep Formu</h3>
                  <p className="text-xs text-white/70 mb-4">LIOX ERP'yi kendi gözlerinizle görün.</p>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-demo-popup'))}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#dd222c] text-white text-sm font-bold hover:bg-[#c41e2a] transition"
                  >
                    Demo Talep Et
                    <i className="fa-solid fa-arrow-right text-xs" />
                  </button>
                </div>
              </aside>
            )}
          </div>

          {/* Sidebar for other templates */}
          {post.template !== 'with_sidebar' && post.template !== 'with_form' && (
            <div className="hidden lg:block absolute right-8 top-40 w-64">
              {renderSidebar()}
            </div>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {post.show_related_posts && relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-black text-[#0a1628] font-logo mb-8">İlgili Yazılar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, post.related_posts_count).map((relPost) => (
                <Link key={relPost.id} to={`/blog/${relPost.slug}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                  {relPost.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={relPost.featured_image} alt={relPost.featured_image_alt || relPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getColorClasses(relPost.category.color)}`}>
                      {relPost.category.title}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#dd222c] transition">
                      {relPost.title}
                    </h3>
                    <div className="text-xs text-gray-500">{relPost.reading_time} dk okuma</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': post.schema_type || 'Article',
            headline: post.title,
            description: post.excerpt,
            image: post.featured_image || post.og_image,
            author: {
              '@type': 'Person',
              name: post.author,
              jobTitle: post.author_role
            },
            publisher: {
              '@type': 'Organization',
              name: 'LIOX ERP'
            },
            datePublished: post.publish_date,
            dateModified: post.updated_date || post.publish_date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': typeof window !== 'undefined' ? window.location.href : ''
            }
          })
        }}
      />
    </div>
  )
}
