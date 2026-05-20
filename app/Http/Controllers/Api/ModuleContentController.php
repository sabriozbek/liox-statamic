<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ResolvesStatamicAssets;
use App\Services\SeoService;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;

class ModuleContentController extends Controller
{
    use ResolvesStatamicAssets;

    public function __construct(
        private SeoService $seoService
    ) {}

    public function index()
    {
        $entries = Cache::remember('api_modules_index', 3600, function () {
            return Entry::query()
                ->where('collection', 'modules')
                ->get()
                ->map(function ($entry) {
                    return [
                        'id' => $entry->id(),
                        'slug' => $entry->slug(),
                        'title' => $entry->get('title'),
                        'short_description' => $entry->get('short_description'),
                        'icon' => $entry->get('icon'),
                        'features' => $entry->get('features') ?? [],
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
        $entry = Cache::remember("api_modules_show_{$slug}", 3600, function () use ($slug) {
            return Entry::query()
                ->where('collection', 'modules')
                ->where('slug', $slug)
                ->first();
        });

        if (!$entry) {
            return response()->json(['error' => 'Modül bulunamadı'], 404);
        }

        $resolvedSeo = $this->seoService->resolveEntryMeta($entry, 'modul/'.$slug);

        return response()->json([
            'id' => $entry->id(),
            'slug' => $entry->slug(),
            'title' => $entry->get('title'),
            'short_description' => $entry->get('short_description'),
            'content' => $entry->get('content') ?? [],
            'icon' => $entry->get('icon'),
            'features' => $entry->get('features') ?? [],
            'hero_badge' => $entry->get('hero_badge'),
            'hero_highlights' => $entry->get('hero_highlights') ?? [],
            'hero_stats' => $entry->get('hero_stats') ?? [],
            'hero_visual_url' => $this->resolveAssetUrl($entry->get('hero_visual_url')),
            'pain_points_title' => $entry->get('pain_points_title'),
            'pain_points' => $entry->get('pain_points') ?? [],
            'capabilities_title' => $entry->get('capabilities_title'),
            'capabilities' => $this->normalizeAssetGrid($entry->get('capabilities') ?? [], ['image_url']),
            'split_title' => $entry->get('split_title'),
            'split_description' => $entry->get('split_description'),
            'split_image_url' => $this->resolveAssetUrl($entry->get('split_image_url')),
            'split_items' => $entry->get('split_items') ?? [],
            'extra_section_title' => $entry->get('extra_section_title'),
            'extra_section_description' => $entry->get('extra_section_description'),
            'extra_section_image_url' => $this->resolveAssetUrl($entry->get('extra_section_image_url')),
            'extra_section_reverse' => $entry->get('extra_section_reverse'),
            'extra_section_items' => $entry->get('extra_section_items') ?? [],
            'customer_logos' => $this->normalizeAssetGrid($entry->get('customer_logos') ?? [], ['logo_url']),
            'testimonial_quote' => $entry->get('testimonial_quote'),
            'testimonial_author' => $entry->get('testimonial_author'),
            'testimonial_company' => $entry->get('testimonial_company'),
            'testimonial_image_url' => $this->resolveAssetUrl($entry->get('testimonial_image_url')),
            'bottom_cta_title' => $entry->get('bottom_cta_title'),
            'bottom_cta_description' => $entry->get('bottom_cta_description'),
            'sectors' => $entry->get('sectors') ?? [],
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
            'structured_data' => $this->seoService->buildStructuredData('modul/'.$slug),
        ]);
    }
}
