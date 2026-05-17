<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\ResolvesStatamicAssets;
use Statamic\Facades\Entry;

class TestimonialContentController extends Controller
{
    use ResolvesStatamicAssets;

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
                ];
            })->values();

        return response()->json($entries);
    }
}
