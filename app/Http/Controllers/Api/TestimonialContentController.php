<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use App\Support\ResolvesStatamicAssets;
use Statamic\Facades\Entry;

class TestimonialContentController extends Controller
{
    use ResolvesStatamicAssets;

    public function __construct(
        private SeoService $seoService
    ) {}

    public function index()
    {
        $entries = Entry::query()
            ->where('collection', 'testimonials')
            ->get()
            ->map(function ($entry) {
                return [
                    'slug' => $entry->slug(),
                    'title' => $entry->get('title'),
                    'company' => $entry->get('company'),
                    'sector' => $entry->get('sector'),
                    'quote' => $entry->get('quote'),
                    'author' => $entry->get('author'),
                    'youtube_embed_url' => $entry->get('youtube_embed_url'),
                    'logo_url' => $this->resolveAssetUrl($entry->get('logo_url')),
                    'image_url' => $this->resolveAssetUrl($entry->get('image_url')),
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
                    'resolved_seo' => $this->seoService->resolveEntryMeta($entry, 'basari-hikayeleri#'.$entry->slug()),
                    'structured_data' => $this->seoService->buildStructuredData('basari-hikayeleri'),
                ];
            })->values();

        return response()->json($entries);
    }
}
