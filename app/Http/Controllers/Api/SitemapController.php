<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SitemapController extends Controller
{
    /**
     * Dinamik sitemap.xml döndür
     */
    public function index(): Response
    {
        $sitemap = Cache::remember('sitemap_xml', 3600, function () {
            return $this->generateSitemap();
        });

        return response($sitemap, 200, [
            'Content-Type' => 'application/xml',
            'X-Robots-Tag' => 'noindex',
        ]);
    }

    /**
     * Sitemap XML oluştur
     */
    private function generateSitemap(): string
    {
        $urls = [];

        // Statik sayfalar
        $staticPages = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/erp', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/sektor-lp', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/iletisim', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => '/blog', 'priority' => '0.8', 'changefreq' => 'weekly'],
        ];

        foreach ($staticPages as $page) {
            $urls[] = $this->buildUrl(url($page['loc']), $page['priority'], $page['changefreq']);
        }

        // Dinamik sektör sayfaları
        $urls = array_merge($urls, $this->getSectorUrls());

        // Dinamik blog sayfaları
        $urls = array_merge($urls, $this->getBlogUrls());

        // Dinamik modül sayfaları
        $urls = array_merge($urls, $this->getModuleUrls());

        return $this->buildSitemapXml($urls);
    }

    /**
     * Sektör URL'lerini al
     */
    private function getSectorUrls(): array
    {
        $urls = [];

        if (class_exists('\Statamic\Facades\Entry')) {
            try {
                $sectors = \Statamic\Facades\Entry::query()
                    ->in('sectors')
                    ->where('status', 'published')
                    ->get();

                foreach ($sectors as $sector) {
                    $urls[] = $this->buildUrl(
                        url('/sektor/' . $sector->slug),
                        '0.8',
                        'weekly',
                        $sector->updated_at?->toAtomString()
                    );
                }
            } catch (\Exception $e) {
                // Statamic not available
            }
        }

        return $urls;
    }

    /**
     * Blog URL'lerini al
     */
    private function getBlogUrls(): array
    {
        $urls = [];

        if (class_exists('\Statamic\Facades\Entry')) {
            try {
                $posts = \Statamic\Facades\Entry::query()
                    ->in('blog')
                    ->where('status', 'published')
                    ->get();

                foreach ($posts as $post) {
                    $urls[] = $this->buildUrl(
                        url('/blog/' . $post->slug),
                        '0.7',
                        'monthly',
                        $post->updated_at?->toAtomString()
                    );
                }
            } catch (\Exception $e) {
                // Statamic not available
            }
        }

        return $urls;
    }

    /**
     * Modül URL'lerini al
     */
    private function getModuleUrls(): array
    {
        $urls = [];

        if (class_exists('\Statamic\Facades\Entry')) {
            try {
                $modules = \Statamic\Facades\Entry::query()
                    ->in('modules')
                    ->where('status', 'published')
                    ->get();

                foreach ($modules as $module) {
                    $urls[] = $this->buildUrl(
                        url('/modul/' . $module->slug),
                        '0.7',
                        'monthly',
                        $module->updated_at?->toAtomString()
                    );
                }
            } catch (\Exception $e) {
                // Statamic not available
            }
        }

        return $urls;
    }

    /**
     * URL elementi oluştur
     */
    private function buildUrl(string $loc, string $priority, string $changefreq, ?string $lastmod = null): string
    {
        $lastmodTag = $lastmod
            ? "<lastmod>{$lastmod}</lastmod>"
            : "<lastmod>" . now()->toAtomString() . "</lastmod>";

        return <<<XML
<url>
    <loc>{$loc}</loc>
    {$lastmodTag}
    <changefreq>{$changefreq}</changefreq>
    <priority>{$priority}</priority>
</url>
XML;
    }

    /**
     * Sitemap XML wrapper oluştur
     */
    private function buildSitemapXml(array $urls): string
    {
        $urlStrings = implode("\n", $urls);

        return <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{$urlStrings}
</urlset>
XML;
    }
}
