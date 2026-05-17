<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ResolvesStatamicAssets;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Entry;

class EventContentController extends Controller
{
    use ResolvesStatamicAssets;

    public function index()
    {
        $entries = Cache::remember('api_events_index', 3600, function () {
            return Entry::query()
                ->where('collection', 'events')
                ->get()
                ->map(function ($entry) {
                    return [
                        'id' => $entry->id(),
                        'slug' => $entry->slug(),
                        'title' => $entry->get('title'),
                        'status' => $entry->get('status', 'upcoming'),
                        'event_type' => $entry->get('event_type', 'webinar'),
                        'event_date' => $entry->get('event_date'),
                        'event_time' => $entry->get('event_time'),
                        'location' => $entry->get('location'),
                        'hero_badge' => $entry->get('hero_badge'),
                        'excerpt' => $entry->get('excerpt'),
                        'registration_url' => $entry->get('registration_url'),
                        'featured_image' => $this->resolveAssetUrl($entry->get('featured_image')),
                        'featured_image_alt' => $entry->get('featured_image_alt'),
                        'hero_points' => $entry->get('hero_points') ?? [],
                    ];
                })
                ->values();
        });

        return response()->json($entries);
    }

    public function show(string $slug)
    {
        $entry = Cache::remember("api_events_show_{$slug}", 3600, function () use ($slug) {
            return Entry::query()
                ->where('collection', 'events')
                ->where('slug', $slug)
                ->first();
        });

        if (! $entry) {
            return response()->json(['error' => 'Etkinlik bulunamadı'], 404);
        }

        return response()->json([
            'id' => $entry->id(),
            'slug' => $entry->slug(),
            'title' => $entry->get('title'),
            'status' => $entry->get('status', 'upcoming'),
            'event_type' => $entry->get('event_type', 'webinar'),
            'event_date' => $entry->get('event_date'),
            'event_time' => $entry->get('event_time'),
            'event_end_date' => $entry->get('event_end_date'),
            'location' => $entry->get('location'),
            'registration_url' => $entry->get('registration_url'),
            'hero_badge' => $entry->get('hero_badge'),
            'excerpt' => $entry->get('excerpt'),
            'featured_image' => $this->resolveAssetUrl($entry->get('featured_image')),
            'featured_image_alt' => $entry->get('featured_image_alt'),
            'hero_points' => $entry->get('hero_points') ?? [],
            'content' => $entry->get('content') ?? [],
            'agenda_title' => $entry->get('agenda_title'),
            'agenda_items' => $entry->get('agenda_items') ?? [],
            'speakers_title' => $entry->get('speakers_title'),
            'speakers' => $this->normalizeAssetGrid($entry->get('speakers') ?? [], ['image']),
            'cta_title' => $entry->get('cta_title'),
            'cta_description' => $entry->get('cta_description'),
            'cta_button_text' => $entry->get('cta_button_text'),
            'seo_title' => $entry->get('seo_title'),
            'seo_description' => $entry->get('seo_description'),
        ]);
    }
}
