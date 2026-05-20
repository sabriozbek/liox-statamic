<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use App\Support\ResolvesStatamicAssets;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;

class SectorContentController extends Controller
{
    use ResolvesStatamicAssets;

    public function __construct(
        private SeoService $seoService
    ) {}

    public function index()
    {
        $entries = Cache::remember('api_sectors_index', 3600, function () {
            return Entry::query()
                ->where('collection', 'sectors')
                ->get()
                ->map(function ($entry) {
                    return [
                        'id' => $entry->id(),
                        'slug' => $entry->slug(),
                        'title' => $entry->get('title'),
                        'description' => $entry->get('description'),
                        'hero_badge' => $entry->get('hero_badge'),
                        'metrics' => $entry->get('metrics') ?? [],
                        'benefits' => $entry->get('benefits') ?? [],
                        'seo_title' => $entry->get('seo_title'),
                        'seo_description' => $entry->get('seo_description'),
                    ];
                })
                ->values();
        });

        return response()->json($entries);
    }

    public function show(string $slug)
    {
        $entry = Cache::remember("api_sectors_show_{$slug}", 3600, function () use ($slug) {
            return Entry::query()
                ->where('collection', 'sectors')
                ->where('slug', $slug)
                ->first();
        });

        if (!$entry) {
            return response()->json(['error' => 'Sektör bulunamadı'], 404);
        }

        // Sektöre ait testimonial'ları bul (sector alanına göre filtrele)
        $sectorTitle = $entry->get('title') ?? '';
        $testimonials = Entry::query()
            ->where('collection', 'testimonials')
            ->where('status', 'published')
            ->get()
            ->filter(function ($testimonial) use ($sectorTitle) {
                $testimonialSector = $testimonial->get('sector') ?? '';
                // Sektör adı testimonial'ın sector alanı ile eşleşiyor mu kontrol et
                return stripos($testimonialSector, $sectorTitle) !== false
                    || stripos($sectorTitle, $testimonialSector) !== false;
            })
            ->map(function ($testimonial) {
                return [
                    'slug' => $testimonial->slug(),
                    'title' => $testimonial->get('title'),
                    'company' => $testimonial->get('company'),
                    'sector' => $testimonial->get('sector'),
                    'quote' => $testimonial->get('quote'),
                    'author' => $testimonial->get('author'),
                    'youtube_embed_url' => $testimonial->get('youtube_embed_url'),
                    'logo_url' => $this->resolveAssetUrl($testimonial->get('logo_url')),
                    'image_url' => $this->resolveAssetUrl($testimonial->get('image_url')),
                ];
            })
            ->values()
            ->all();

        $resolvedSeo = $this->seoService->resolveEntryMeta($entry, 'sektor/'.$slug);

        return response()->json([
            'id' => $entry->id(),
            'slug' => $entry->slug(),
            'title' => $entry->get('title'),
            'description' => $entry->get('description'),
            'hero_badge' => $entry->get('hero_badge'),
            'hero_visual' => $this->resolveAssetUrl($entry->get('hero_visual')),
            'hero_points' => $entry->get('hero_points') ?? [],
            'content' => $entry->get('content') ?? [],
            'industry_stats_title' => $entry->get('industry_stats_title'),
            'industry_stats' => $entry->get('industry_stats') ?? [],
            'metrics' => $entry->get('metrics') ?? [],
            'benefits' => $entry->get('benefits') ?? [],
            'process_title' => $entry->get('process_title'),
            'process_subtitle' => $entry->get('process_subtitle'),
            'process_steps' => $entry->get('process_steps') ?? [],
            'split_title' => $entry->get('split_title'),
            'split_description' => $entry->get('split_description'),
            'split_image' => $this->resolveAssetUrl($entry->get('split_image')),
            'split_items' => $entry->get('split_items') ?? [],
            'success_title' => $entry->get('success_title'),
            'success_quote' => $entry->get('success_quote'),
            'success_author' => $entry->get('success_author'),
            'success_company' => $entry->get('success_company'),
            'success_author_role' => $entry->get('success_author_role'),
            'success_image' => $this->resolveAssetUrl($entry->get('success_image')),
            'youtube_embed_url' => $entry->get('youtube_embed_url'),
            'faq_title' => $entry->get('faq_title'),
            'faqs' => $entry->get('faqs') ?? [],
            'related_modules_title' => $entry->get('related_modules_title'),
            'related_modules' => collect($entry->get('related_modules') ?? [])
                ->map(function ($module) {
                    if (!$module) {
                        return null;
                    }

                    return [
                        'id' => method_exists($module, 'id') ? $module->id() : null,
                        'title' => method_exists($module, 'get') ? $module->get('title') : null,
                        'slug' => method_exists($module, 'slug') ? $module->slug() : null,
                    ];
                })
                ->filter(fn ($module) => filled($module['slug'] ?? null))
                ->values()
                ->all(),
            'customer_logos' => $this->normalizeAssetGrid($entry->get('customer_logos') ?? [], ['logo']),
            'bottom_cta_title' => $entry->get('bottom_cta_title'),
            'bottom_cta_description' => $entry->get('bottom_cta_description'),
            'bottom_form_title' => $entry->get('bottom_form_title'),
            'bottom_form_description' => $entry->get('bottom_form_description'),
            'bottom_form_image' => $this->resolveAssetUrl($entry->get('bottom_form_image')),
            'extra_section_title' => $entry->get('extra_section_title'),
            'extra_section_description' => $entry->get('extra_section_description'),
            'extra_section_image' => $this->resolveAssetUrl($entry->get('extra_section_image')),
            'extra_section_items' => $entry->get('extra_section_items') ?? [],
            'seo_title' => $entry->get('seo_title'),
            'seo_description' => $entry->get('seo_description'),
            'canonical_url' => $entry->get('canonical_url'),
            'og_title' => $entry->get('og_title'),
            'og_description' => $entry->get('og_description'),
            'og_image' => $this->resolveAssetUrl($entry->get('og_image')),
            'x_title' => $entry->get('x_title'),
            'x_description' => $entry->get('x_description'),
            'x_handle' => $entry->get('x_handle'),
            'robots' => $entry->get('robots') ?? [],
            'resolved_seo' => $resolvedSeo,
            'structured_data' => $this->seoService->buildStructuredData('sektor/'.$slug),
            // İlişkili testimonial'lar
            'testimonials' => $testimonials,
        ]);
    }
}
