import { Link } from 'react-router'
import SeoManager from '@/components/seo/SeoManager'
import type { HomePageContent } from '@/services/api'

interface GenericContentPageProps {
  content: HomePageContent | null
  loading: boolean
  fallbackTitle: string
}

export default function GenericContentPage({ content, loading, fallbackTitle }: GenericContentPageProps) {
  const blocks = Array.isArray(content?.generic_content_blocks) ? content.generic_content_blocks : []

  return (
    <>
      <SeoManager
        title={(content?.resolved_seo as any)?.title || content?.seo_title || content?.title || fallbackTitle}
        description={(content?.resolved_seo as any)?.description || content?.seo_description || null}
        canonicalUrl={(content?.resolved_seo as any)?.canonical || content?.canonical_url || null}
        robots={((content?.resolved_seo as any)?.robots as string[]) || content?.robots || null}
        ogTitle={(content?.resolved_seo as any)?.og_title || content?.og_title || fallbackTitle}
        ogDescription={(content?.resolved_seo as any)?.og_description || content?.og_description || content?.seo_description || null}
        ogImage={(content?.resolved_seo as any)?.og_image || content?.og_image || null}
        xTitle={(content?.resolved_seo as any)?.x_title || content?.x_title || fallbackTitle}
        xDescription={(content?.resolved_seo as any)?.x_description || content?.x_description || content?.seo_description || null}
        xHandle={(content?.resolved_seo as any)?.x_handle || content?.x_handle || null}
        siteName={(content?.resolved_seo as any)?.site_name || null}
        siteNamePosition={(content?.resolved_seo as any)?.site_name_position || null}
        siteNameSeparator={(content?.resolved_seo as any)?.site_name_separator || null}
        enabled={(content?.resolved_seo as any)?.enabled ?? content?.seo_enabled ?? true}
        structuredData={content?.structured_data || []}
      />

      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-black font-logo text-secondary uppercase mb-5">
            {content?.generic_hero_baslik || content?.title || fallbackTitle}
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.generic_hero_aciklama || content?.seo_description || (loading ? ' ' : '')}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white flex-1">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {!content && loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
              <div className="h-28 bg-gray-50 rounded-2xl" />
              <div className="h-28 bg-gray-50 rounded-2xl" />
            </div>
          ) : null}

          {blocks.map((block: any, index: number) => {
            const type = block.type || block.set

            if (type === 'text_block') {
              return (
                <div key={index} className="space-y-4">
                  {block.title ? <h2 className="text-2xl font-black text-secondary font-logo">{block.title}</h2> : null}
                  <div className="prose prose-slate max-w-none text-gray-700 whitespace-pre-line">
                    {block.content}
                  </div>
                </div>
              )
            }

            if (type === 'feature_grid') {
              const items = Array.isArray(block.items) ? block.items : []

              return (
                <div key={index} className="space-y-5">
                  {block.title ? <h2 className="text-2xl font-black text-secondary font-logo">{block.title}</h2> : null}
                  <div className="grid md:grid-cols-2 gap-5">
                    {items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <div className="text-lg font-bold text-secondary mb-2">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            if (type === 'cta_block') {
              return (
                <div key={index} className="rounded-3xl border border-gray-200 bg-gradient-to-r from-[#f8fafc] to-white p-8 text-center space-y-4">
                  {block.title ? <h3 className="text-2xl font-black text-secondary font-logo">{block.title}</h3> : null}
                  {block.description ? <p className="text-gray-600 max-w-2xl mx-auto">{block.description}</p> : null}
                  {block.button_text && block.button_url ? (
                    <Link to={block.button_url} className="inline-flex items-center px-6 py-3 rounded-xl bg-[#0a1628] text-white font-bold hover:bg-[#dd222c] transition">
                      {block.button_text}
                    </Link>
                  ) : null}
                </div>
              )
            }

            return null
          })}
        </div>
      </section>
    </>
  )
}
