<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SeoService;
use Statamic\Facades\Entry;
use Statamic\Facades\GlobalSet;

class PageContentController extends Controller
{
    public function __construct(
        private SeoService $seoService
    ) {}

    /**
     * Belirtilen sayfanın içeriğini döndür
     */
    public function show(string $slug)
    {
        $entry = Entry::query()
            ->where('collection', 'pages')
            ->where('slug', $slug)
            ->first();

        if (!$entry) {
            return response()->json(['error' => 'Sayfa bulunamadı'], 404);
        }

        $seoMeta = $this->seoService->getMeta($slug);

        return response()->json([
            'page_type' => $entry->get('page_type'),
            'title' => $entry->get('title'),
            'seo_title' => $entry->get('seo_title'),
            'seo_description' => $entry->get('seo_description'),
            'seo_enabled' => $entry->get('seo_enabled', true),
            'seo_site_name_mode' => $entry->get('seo_site_name_mode', 'inherit'),
            'seo_site_name_custom' => $entry->get('seo_site_name_custom'),
            'seo_site_name_position' => $entry->get('seo_site_name_position', 'inherit'),
            'seo_site_name_separator' => $entry->get('seo_site_name_separator'),
            'robots' => $entry->get('robots') ?? [],
            'hero_baslik' => $entry->get('hero_baslik'),
            'hero_alt_baslik' => $entry->get('hero_alt_baslik'),
            'hero_aciklama' => $entry->get('hero_aciklama'),
            'hero_gorsel' => $entry->get('hero_gorsel'),
            'hero_video_embed' => $entry->get('hero_video_embed'),
            'generic_goster' => $entry->get('generic_goster'),
            'generic_hero_baslik' => $entry->get('generic_hero_baslik'),
            'generic_hero_aciklama' => $entry->get('generic_hero_aciklama'),
            'generic_content_blocks' => $entry->get('generic_content_blocks') ?? [],
            'moduller_baslik' => $entry->get('moduller_baslik'),
            'moduller_alt_baslik' => $entry->get('moduller_alt_baslik'),
            'moduller_goster' => $entry->get('moduller_goster'),
            'sektorler_baslik' => $entry->get('sektorler_baslik'),
            'sektorler_aciklama' => $entry->get('sektorler_aciklama'),
            'sektorler_goster' => $entry->get('sektorler_goster'),
            'basari_baslik' => $entry->get('basari_baslik'),
            'basari_goster' => $entry->get('basari_goster'),
            'video_baslik' => $entry->get('video_baslik'),
            'video_alt_baslik' => $entry->get('video_alt_baslik'),
            'video_embed_url' => $entry->get('video_embed_url'),
            'video_goster' => $entry->get('video_goster'),
            'cta_baslik' => $entry->get('cta_baslik'),
            'cta_aciklama' => $entry->get('cta_aciklama'),
            'cta_buton_metin' => $entry->get('cta_buton_metin'),
            'cta_goster' => $entry->get('cta_goster'),
            'sectors_landing_goster' => $entry->get('sectors_landing_goster'),
            'sectors_landing_baslik' => $entry->get('sectors_landing_baslik'),
            'sectors_landing_aciklama' => $entry->get('sectors_landing_aciklama'),
            'sectors_landing_badges' => $entry->get('sectors_landing_badges') ?? [],
            'seo_keywords' => $entry->get('seo_keywords') ?? [],
            'og_title' => $entry->get('og_title'),
            'og_description' => $entry->get('og_description'),
            'og_image' => $entry->get('og_image'),
            'x_title' => $entry->get('x_title'),
            'x_description' => $entry->get('x_description'),
            'x_handle' => $entry->get('x_handle'),
            'canonical_url' => $entry->get('canonical_url'),
            'schema_type' => $entry->get('schema_type'),
            'sitemap_enabled' => $entry->get('sitemap_enabled', true),
            'sitemap_priority' => $entry->get('sitemap_priority'),
            'sitemap_change_frequency' => $entry->get('sitemap_change_frequency'),
            'structured_data_items' => $entry->get('structured_data_items') ?? [],
            'resolved_seo' => $seoMeta,
            'structured_data' => $this->seoService->buildStructuredData($slug),
        ]);
    }

    /**
     * Ana sayfa içeriğini döndür
     */
    public function home()
    {
        return $this->show('home');
    }

    /**
     * Duyuru bilgilerini döndür
     */
    public function announcement()
    {
        $announcement = GlobalSet::findByHandle('announcement');
        $announcementValues = null;

        try {
            $announcementValues = $announcement?->inDefaultSite()?->data();
        } catch (\Throwable $e) {
            $announcementValues = null;
        }

        if (!$announcement) {
            return response()->json([
                'duyuru_aktif' => true,
                'duyuru_metni' => 'LIOX ERP ile işletmenizi dijitalleştirin!',
                'duyuru_renk' => 'kirmizi',
            ]);
        }

        return response()->json([
            'duyuru_aktif' => data_get($announcementValues, 'duyuru_aktif', true),
            'duyuru_metni' => data_get($announcementValues, 'duyuru_metni', 'LIOX ERP ile işletmenizi dijitalleştirin!'),
            'duyuru_renk' => data_get($announcementValues, 'duyuru_renk', 'kirmizi'),
        ]);
    }

    public function settings()
    {
        $settings = GlobalSet::findByHandle('settings');
        $values = null;

        try {
            $values = $settings?->inDefaultSite()?->data();
        } catch (\Throwable $e) {
            $values = null;
        }

        $ctaVariants = data_get($values, 'cta_variants');
        $messageVariants = data_get($values, 'message_variants');

        return response()->json([
            'site_name' => data_get($values, 'site_name', 'LioXERP'),
            'site_email' => data_get($values, 'site_email'),
            'site_phone' => data_get($values, 'site_phone'),
            'site_address' => data_get($values, 'site_address'),
            'google_analytics_id' => data_get($values, 'google_analytics_id'),
            'google_tag_manager_id' => data_get($values, 'google_tag_manager_id'),
            'cta_variants' => is_string($ctaVariants) ? json_decode($ctaVariants, true) : $ctaVariants,
            'message_variants' => is_string($messageVariants) ? json_decode($messageVariants, true) : $messageVariants,
        ]);
    }

    /**
     * Tüm sayfaların listesini döndür
     */
    public function index()
    {
        $pages = Entry::query()
            ->where('collection', 'pages')
            ->orderBy('title')
            ->get();

        return response()->json($pages->map(function ($page) {
            return [
                'id' => $page->id(),
                'slug' => $page->slug(),
                'title' => $page->get('title'),
            ];
        }));
    }
}
