# Laravel + Statamic + Frontend Performans Notları

## 1. Laravel / Statamic render katmanı

### Statamic static cache
- Dosya: [`config/statamic/static_caching.php`](config/statamic/static_caching.php)
- Başlangıç için `half`, agresif production için `full` stratejisi önerilir.
- Public sayfalarda PHP render maliyetini ciddi düşürür.

### Deploy sonrası zorunlu komutlar
- [`php artisan config:cache`](artisan)
- [`php artisan route:cache`](artisan)
- [`php artisan view:cache`](artisan)
- [`php artisan statamic:stache:warm`](artisan)
- [`php artisan optimize:clear`](artisan) yalnızca bakım / debug durumlarında

### PHP-FPM / OPcache
- OPcache aktif olmalı
- Production'da `opcache.validate_timestamps=0` tercih edilebilir
- PHP-FPM worker sayısı trafik yüküne göre ayarlanmalı

### Queue / Horizon
- Paket: [`laravel/horizon`](composer.json)
- Queue'ya alınabilecek işler:
  - CRM sync
  - mail gönderimi
  - static cache warm
  - image transform / heavy asset processing

## 2. Nginx / HTTP katmanı

### Sıkıştırma
- Dosya: [`docker/nginx.conf`](docker/nginx.conf)
- Gzip açık, production'da Brotli varsa ayrıca eklenebilir.

### Static asset cache
- JS/CSS/font/image dosyaları için long cache kullanılmalı.
- Mevcut ayar: [`docker/nginx.conf`](docker/nginx.conf)

### Reverse proxy cache
- Anonymous public landing/blog/sektör/event sayfalarında ek hız için düşünülmeli.

## 3. Statamic içerik ve asset katmanı

### Stache
- İçerik diskten okunduğu için deploy sonrası warm etmek önemli.

### Asset optimizasyonu
- Hero görselleri yükleme anında optimize edilmeli.
- WebP / AVIF varyantları üretilebilir.
- Glide output'ları önceden hazırlanabilir.

### Asset URL normalizasyonu
- API tarafında asset alanları frontend'in kullanacağı tam / doğru URL formatında dönmeli.

## 4. Frontend JS katmanı

### Route bazlı lazy loading
- Dosya: [`frontend/src/App.tsx`](frontend/src/App.tsx)
- Büyük sayfalar `React.lazy()` ile ayrılmalı:
  - blog detay
  - event detail
  - sektör detay
  - başarı hikayeleri

### Vite chunk stratejisi
- Dosya: [`frontend/vite.config.ts`](frontend/vite.config.ts)
- `manualChunks` daha detaylı ayrılabilir:
  - `blog`
  - `events`
  - `marketing`
  - `forms`

### Görsel optimizasyonu
- Hero dışındaki resimlerde `loading="lazy"`
- Mümkünse `decoding="async"`

### API caching
- Tekrarlanan liste endpoint'leri client-side cache ile tutulmalı.
- SWR / TanStack Query değerlendirilebilir.

## 5. Bu proje için uygulanacak öncelik sırası

1. Statamic static caching aç
2. Deploy pipeline'a cache/stache warm komutları ekle
3. Route-based lazy loading yap
4. Büyük görselleri optimize et
5. Public sayfalarda daha agresif HTTP cache uygula
6. Gerekirse SSR / SSG mimarisine geç

## 6. Hedeflenen sonuç

- Daha hızlı ilk byte süresi
- Daha düşük PHP render maliyeti
- Daha küçük initial JS yükü
- Daha hızlı blog / sektör / etkinlik detay sayfaları
- Daha stabil production performansı
