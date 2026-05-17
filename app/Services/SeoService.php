<?php

namespace App\Services;

use Spatie\SchemaOrg\Schema;
use Illuminate\Support\Facades\Cache;
use Statamic\Facades\GlobalSet;
use Statamic\Facades\Entry;

class SeoService
{
    private array $defaults = [];

    public function __construct()
    {
        $seo = null;
        $seoValues = null;

        try {
            $seo = GlobalSet::findByHandle('seo');
            $seoValues = $seo?->inDefaultSite()?->data();
        } catch (\Throwable $e) {
            $seo = null;
            $seoValues = null;
        }

        $this->defaults = [
            'title' => data_get($seoValues, 'default_title') ?? 'LioXERP ERP Programı | Kurumsal Kaynak Planlama ve Entegre İş Çözümleri',
            'description' => data_get($seoValues, 'default_description') ?? 'LioXERP, Uyumsoft tarafından geliştirilmiş kurumsal kaynak planlama (ERP) yazılımıdır. LioXERP ERP programı ile üretim, finans, muhasebe, insan kaynakları, depo ve satış süreçlerinizi tek platformda yönetin. Türkiye\'nin yerli ERP çözümü.',
            'keywords' => is_array(data_get($seoValues, 'default_keywords')) ? implode(', ', data_get($seoValues, 'default_keywords')) : 'erp, erp programı, erp yazılımı, kurumsal kaynak planlama, liox erp, lioxerp, kurumsal erp sistemi, bulut erp, uyumsoft erp, uyumsoft lioxerp',
            'og_image' => data_get($seoValues, 'default_og_image') ?? '/assets/hero-bg.jpg',
            'site_name' => data_get($seoValues, 'site_name') ?? 'LioXERP',
            'site_name_position' => data_get($seoValues, 'site_name_position') ?? 'after',
            'site_name_separator' => data_get($seoValues, 'site_name_separator') ?? '|',
            'twitter_handle' => data_get($seoValues, 'twitter_handle') ?? '@lioxerp',
            'default_x_handle' => data_get($seoValues, 'default_x_handle') ?? '@lioxerp',
            'default_robots' => data_get($seoValues, 'default_robots') ?? [],
            'default_canonical_base' => rtrim(data_get($seoValues, 'default_canonical_base') ?? config('app.url'), '/'),
            'default_sitemap_priority' => data_get($seoValues, 'default_sitemap_priority') ?? '0.5',
            'default_sitemap_change_frequency' => data_get($seoValues, 'default_sitemap_change_frequency') ?? 'monthly',
        ];
    }

    /**
     * Sayfa için SEO meta verilerini al
     */
    public function getMeta(string $page): array
    {
        $cacheKey = "seo_meta_{$page}";

        return Cache::remember($cacheKey, 3600, function () use ($page) {
            return $this->loadMetaFromContent($page);
        });
    }

    /**
     * Statamic content'ten meta yükle
     */
    private function loadMetaFromContent(string $page): array
    {
        // Statamic entry varsa onu kullan
        if (class_exists('\Statamic\Facades\Entry')) {
            try {
                $entry = \Statamic\Facades\Entry::findByUri('/' . ltrim($page, '/'));

                if ($entry) {
                    $siteNameMode = $entry->get('seo_site_name_mode', 'inherit');
                    $siteName = $siteNameMode === 'custom'
                        ? ($entry->get('seo_site_name_custom') ?: $this->defaults['site_name'])
                        : ($siteNameMode === 'disabled' ? null : $this->defaults['site_name']);

                    return [
                        'enabled' => (bool) $entry->get('seo_enabled', true),
                        'title' => $entry->get('seo_title') ?? $entry->title ?? $this->defaults['title'],
                        'description' => $entry->get('seo_description') ?? $entry->get('description') ?? $this->defaults['description'],
                        'keywords' => is_array($entry->get('seo_keywords')) ? implode(', ', $entry->get('seo_keywords')) : ($entry->get('seo_keywords') ?? $this->defaults['keywords']),
                        'og_image' => $entry->get('og_image') ?? $entry->asset('og_image')?->url ?? url($this->defaults['og_image']),
                        'canonical' => $entry->get('canonical_url') ?: $this->defaults['default_canonical_base'].'/'.ltrim($page, '/'),
                        'type' => $entry->get('schema_type') ?? 'web_page',
                        'site_name' => $siteName,
                        'site_name_position' => $entry->get('seo_site_name_position', 'inherit') === 'inherit' ? $this->defaults['site_name_position'] : $entry->get('seo_site_name_position'),
                        'site_name_separator' => $entry->get('seo_site_name_separator') ?: $this->defaults['site_name_separator'],
                        'robots' => $entry->get('robots') ?? $this->defaults['default_robots'],
                        'og_title' => $entry->get('og_title') ?? ($entry->get('seo_title') ?? $entry->title ?? $this->defaults['title']),
                        'og_description' => $entry->get('og_description') ?? ($entry->get('seo_description') ?? $this->defaults['description']),
                        'x_title' => $entry->get('x_title') ?? ($entry->get('seo_title') ?? $entry->title ?? $this->defaults['title']),
                        'x_description' => $entry->get('x_description') ?? ($entry->get('seo_description') ?? $this->defaults['description']),
                        'x_handle' => $entry->get('x_handle') ?? $this->defaults['default_x_handle'],
                        'sitemap_enabled' => (bool) $entry->get('sitemap_enabled', true),
                        'sitemap_priority' => $entry->get('sitemap_priority') ?? $this->defaults['default_sitemap_priority'],
                        'sitemap_change_frequency' => $entry->get('sitemap_change_frequency') ?? $this->defaults['default_sitemap_change_frequency'],
                        'structured_data_items' => $entry->get('structured_data_items') ?? [],
                    ];
                }
            } catch (\Exception $e) {
                // Statamic not available, use defaults
            }
        }

        // Default meta
        return [
            'enabled' => true,
            'title' => $this->defaults['title'],
            'description' => $this->defaults['description'],
            'keywords' => $this->defaults['keywords'],
            'og_image' => url($this->defaults['og_image']),
            'canonical' => $this->defaults['default_canonical_base'].'/'.ltrim($page, '/'),
            'type' => 'web_page',
            'site_name' => $this->defaults['site_name'],
            'site_name_position' => $this->defaults['site_name_position'],
            'site_name_separator' => $this->defaults['site_name_separator'],
            'robots' => $this->defaults['default_robots'],
            'og_title' => $this->defaults['title'],
            'og_description' => $this->defaults['description'],
            'x_title' => $this->defaults['title'],
            'x_description' => $this->defaults['description'],
            'x_handle' => $this->defaults['default_x_handle'],
            'sitemap_enabled' => true,
            'sitemap_priority' => $this->defaults['default_sitemap_priority'],
            'sitemap_change_frequency' => $this->defaults['default_sitemap_change_frequency'],
            'structured_data_items' => [],
        ];
    }

    public function buildStructuredData(string $page): array
    {
        $meta = $this->getMeta($page);
        $scripts = [];

        try {
            $entry = Entry::findByUri('/' . ltrim($page, '/'));
        } catch (\Throwable $e) {
            $entry = null;
        }

        $permalink = $meta['canonical'] ?? url($page);
        $title = $meta['title'] ?? $this->defaults['title'];

        $scripts[] = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $meta['site_name'] ?? $this->defaults['site_name'],
            'url' => config('app.url'),
            'logo' => url($this->defaults['og_image']),
        ];

        $scripts[] = [
            '@context' => 'https://schema.org',
            '@type' => 'SoftwareApplication',
            'name' => $title,
            'operatingSystem' => 'Web',
            'applicationCategory' => 'BusinessApplication',
            'offers' => [
                '@type' => 'Offer',
                'priceCurrency' => 'TRY',
                'availability' => 'https://schema.org/InStock',
                'url' => $permalink,
            ],
        ];

        if ($entry) {
            $scripts[] = [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    [
                        '@type' => 'ListItem',
                        'position' => 1,
                        'name' => 'Ana Sayfa',
                        'item' => url('/'),
                    ],
                    [
                        '@type' => 'ListItem',
                        'position' => 2,
                        'name' => $entry->get('title') ?? $title,
                        'item' => $permalink,
                    ],
                ],
            ];
        }

        foreach ($meta['structured_data_items'] ?? [] as $item) {
            if (($item['type'] ?? null) === 'faq' && ! empty($item['items'])) {
                $scripts[] = [
                    '@context' => 'https://schema.org',
                    '@type' => 'FAQPage',
                    'mainEntity' => collect($item['items'])->map(fn ($faq) => [
                        '@type' => 'Question',
                        'name' => $faq['question'] ?? '',
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $faq['answer'] ?? '',
                        ],
                    ])->values()->all(),
                ];
            }

            if (($item['type'] ?? null) === 'custom_json' && ! empty($item['json'])) {
                $decoded = json_decode($item['json'], true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $scripts[] = $decoded;
                }
            }
        }

        return $scripts;
    }

    /**
     * Organization schema oluştur
     */
    public function organizationSchema(): string
    {
        $schema = Schema::organization()
            ->name('LioXERP')
            ->url(config('app.url'))
            ->logo(url('/images/logo.svg'))
            ->sameAs([
                'https://www.linkedin.com/company/uyumsoft',
                'https://twitter.com/lioxerp',
            ])
            ->contactPoint([
                Schema::contactPoint()
                    ->telephone('+90-216-315-14-14')
                    ->contactType('sales')
                    ->availableLanguage(['Turkish', 'English']),
            ]);

        return $schema->toScript();
    }

    /**
     * Software Application schema oluştur
     */
    public function softwareSchema(): string
    {
        $schema = Schema::softwareApplication()
            ->name('LioXERP ERP Programı')
            ->applicationCategory('BusinessApplication')
            ->operatingSystem('Web')
            ->offers([
                Schema::offer()
                    ->price('0')
                    ->priceCurrency('TRY'),
            ]);

        return $schema->toScript();
    }

    /**
     * Breadcrumb schema oluştur
     */
    public function breadcrumbSchema(array $items): string
    {
        $schema = Schema::breadcrumbList();

        foreach ($items as $index => $item) {
            $schema->itemListElement([
                Schema::listItem()
                    ->position($index + 1)
                    ->name($item['name'])
                    ->item($item['url'] ?? url($item['path'])),
            ]);
        }

        return $schema->toScript();
    }

    /**
     * FAQ schema oluştur
     */
    public function faqSchema(array $faqs): string
    {
        $schema = Schema::faqPage();

        foreach ($faqs as $faq) {
            $schema->mainEntity([
                Schema::question()
                    ->name($faq['question'])
                    ->acceptedAnswer([
                        Schema::answer()
                            ->text($faq['answer']),
                    ]),
            ]);
        }

        return $schema->toScript();
    }

    /**
     * Dinamik OG image URL oluştur
     */
    public function getOgImageUrl(string $page, ?string $sector = null): string
    {
        if ($sector) {
            return url("/api/seo/og-image/{$page}?sector={$sector}");
        }

        return url("/api/seo/og-image/{$page}");
    }
}
