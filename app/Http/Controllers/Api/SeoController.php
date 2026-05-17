<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class SeoController extends Controller
{
    /**
     * Dinamik OG image oluştur
     */
    public function ogImage(Request $request, string $page): Response
    {
        $sector = $request->get('sector');

        // Cache key
        $cacheKey = "og_image_{$page}" . ($sector ? "_{$sector}" : '');

        // Önbellek kontrolü (1 gün)
        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response($cached, 200, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }

        // Browsershot ile görsel oluştur
        $html = $this->buildOgImageHtml($page, $sector);

        try {
            $image = Browsershot::html($html)
                ->windowSize(1200, 630)
                ->screenshot();

            // Önbelleğe al
            Cache::put($cacheKey, $image, now()->addDay());

            return response($image, 200, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        } catch (\Exception $e) {
            // Fallback: varsayılan OG image
            $defaultImage = Storage::disk('public')->get('images/og-default.jpg');

            return response($defaultImage ?? '', 200, [
                'Content-Type' => 'image/jpeg',
            ]);
        }
    }

    /**
     * OG image HTML template'i oluştur
     */
    private function buildOgImageHtml(string $page, ?string $sector): string
    {
        $title = $this->getOgTitle($page, $sector);
        $subtitle = $this->getOgSubtitle($page, $sector);

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            color: white;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .title {
            font-size: 72px;
            font-weight: 800;
            text-align: center;
            margin-bottom: 20px;
            line-height: 1.1;
            max-width: 1000px;
        }
        .subtitle {
            font-size: 28px;
            opacity: 0.85;
            text-align: center;
            max-width: 800px;
        }
        .badge {
            position: absolute;
            bottom: 40px;
            right: 60px;
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 30px;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="logo">LioXERP</div>
    <div class="title">{$title}</div>
    <div class="subtitle">{$subtitle}</div>
    <div class="badge">liox.uyumsoft.com</div>
</body>
</html>
HTML;
    }

    /**
     * OG title al
     */
    private function getOgTitle(string $page, ?string $sector): string
    {
        if ($sector) {
            return "{$sector} Sektörü için ERP Çözümü";
        }

        $titles = [
            'home' => 'Akıllı ERP Çözümleri',
            'erp' => 'LioXERP - Tüm İşinizi Yönetin',
            'sector' => 'Sektör Çözümlerimiz',
            'module' => 'ERP Modülleri',
            'blog' => 'Blog & İpuçları',
            'contact' => 'İletişime Geçin',
        ];

        return $titles[$page] ?? 'LioXERP - Akıllı ERP Çözümleri';
    }

    /**
     * OG subtitle al
     */
    private function getOgSubtitle(string $page, ?string $sector): string
    {
        if ($sector) {
            return "{$sector} sektöründeki işletmeler için özelleştirilmiş ERP çözümü";
        }

        return 'Üretim, satış, muhasebe ve daha fazlası tek platformda';
    }
}
