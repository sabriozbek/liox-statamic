<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Asset;
use Statamic\Facades\Entry;

class NewsContentController extends Controller
{
    private function assetUrl($value): string
    {
        if (empty($value)) {
            return '';
        }

        if (is_array($value)) {
            $first = $value[0] ?? null;

            if (is_string($first)) {
                return $this->assetUrl($first);
            }

            if (is_object($first) && method_exists($first, 'url')) {
                return $first->url();
            }
        }

        if (is_object($value) && method_exists($value, 'url')) {
            return $value->url();
        }

        if (is_string($value) && str_contains($value, '::')) {
            return Asset::find($value)?->url() ?? '';
        }

        return (string) $value;
    }

    public function index()
    {
        return response()->json(Cache::remember('api_news_index', 3600, function () {
            return Entry::query()
                ->where('collection', 'news')
                ->orderBy('publish_date', 'desc')
                ->get()
                ->map(fn ($entry) => [
                    'id' => $entry->id(),
                    'slug' => $entry->slug(),
                    'title' => $entry->get('title'),
                    'publish_date' => $entry->get('publish_date'),
                    'category' => $entry->get('category'),
                    'source_label' => $entry->get('source_label'),
                    'hero_badge' => $entry->get('hero_badge'),
                    'excerpt' => $entry->get('excerpt'),
                    'featured_image' => $this->assetUrl($entry->get('featured_image')),
                    'featured_image_alt' => $entry->get('featured_image_alt'),
                    'summary_points' => $entry->get('summary_points') ?? [],
                ])
                ->values();
        }));
    }

    public function show(string $slug)
    {
        $entry = Cache::remember("api_news_show_{$slug}", 3600, function () use ($slug) {
            return Entry::query()
                ->where('collection', 'news')
                ->where('slug', $slug)
                ->first();
        });

        if (! $entry) {
            return response()->json(['error' => 'Haber bulunamadı'], 404);
        }

        return response()->json([
            'id' => $entry->id(),
            'slug' => $entry->slug(),
            'title' => $entry->get('title'),
            'publish_date' => $entry->get('publish_date'),
            'category' => $entry->get('category'),
            'source_label' => $entry->get('source_label'),
            'hero_badge' => $entry->get('hero_badge'),
            'excerpt' => $entry->get('excerpt'),
            'featured_image' => $this->assetUrl($entry->get('featured_image')),
            'featured_image_alt' => $entry->get('featured_image_alt'),
            'summary_points' => $entry->get('summary_points') ?? [],
            'content' => $entry->get('content') ?? [],
            'related_links' => $entry->get('related_links') ?? [],
            'seo_title' => $entry->get('seo_title'),
            'seo_description' => $entry->get('seo_description'),
        ]);
    }
}
