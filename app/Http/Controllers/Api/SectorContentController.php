<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ResolvesStatamicAssets;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;

class SectorContentController extends Controller
{
    use ResolvesStatamicAssets;

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

        return response()->json([
            'id' => $entry->id(),
            'slug' => $entry->slug(),
            'title' => $entry->get('title'),
            'description' => $entry->get('description'),
            'hero_badge' => $entry->get('hero_badge'),
            'hero_visual' => $this->resolveAssetUrl($entry->get('hero_visual')),
            'hero_points' => $entry->get('hero_points') ?? [],
            'content' => $entry->get('content') ?? [],
            'metrics' => $entry->get('metrics') ?? [],
            'benefits' => $entry->get('benefits') ?? [],
            'split_title' => $entry->get('split_title'),
            'split_description' => $entry->get('split_description'),
            'split_image' => $this->resolveAssetUrl($entry->get('split_image')),
            'split_items' => $entry->get('split_items') ?? [],
            'success_title' => $entry->get('success_title'),
            'success_quote' => $entry->get('success_quote'),
            'success_author' => $entry->get('success_author'),
            'success_company' => $entry->get('success_company'),
            'success_image' => $this->resolveAssetUrl($entry->get('success_image')),
            'youtube_embed_url' => $entry->get('youtube_embed_url'),
            'customer_logos' => $this->normalizeAssetGrid($entry->get('customer_logos') ?? [], ['logo']),
            'bottom_cta_title' => $entry->get('bottom_cta_title'),
            'bottom_cta_description' => $entry->get('bottom_cta_description'),
            'extra_section_title' => $entry->get('extra_section_title'),
            'extra_section_description' => $entry->get('extra_section_description'),
            'extra_section_image' => $this->resolveAssetUrl($entry->get('extra_section_image')),
            'extra_section_items' => $entry->get('extra_section_items') ?? [],
            'seo_title' => $entry->get('seo_title'),
            'seo_description' => $entry->get('seo_description'),
        ]);
    }
}
