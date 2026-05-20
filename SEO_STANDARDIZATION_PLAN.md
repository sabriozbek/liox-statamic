# SEO ve Sayfa Veri Akışı Standardizasyon Planı

## Mevcut durum

Frontend sayfaları üç farklı modelle çalışıyor:

1. **Tam statik sayfa**
   - Örnek: [`frontend/src/pages/ErpPage.tsx`](frontend/src/pages/ErpPage.tsx:3)

2. **API ile veri çeken özel sayfa**
   - Örnek: [`frontend/src/pages/Home.tsx`](frontend/src/pages/Home.tsx:18)
   - Örnek: [`frontend/src/pages/EventsPage.tsx`](frontend/src/pages/EventsPage.tsx:42)
   - Örnek: [`frontend/src/pages/ModulePage.tsx`](frontend/src/pages/ModulePage.tsx:43)

3. **API ile veri çeken ortak generic sayfa**
   - Örnek: [`frontend/src/pages/GenericPage.tsx`](frontend/src/pages/GenericPage.tsx:10)
   - Ortak shell: [`frontend/src/components/pages/GenericContentPage.tsx`](frontend/src/components/pages/GenericContentPage.tsx:1)

## Sorunun ana nedeni

SEO verisi tüm endpointlerde aynı formatta dönmüyor.

- [`app/Http/Controllers/Api/PageContentController.php`](app/Http/Controllers/Api/PageContentController.php:88) `resolved_seo` döndürüyor.
- Ama [`app/Http/Controllers/Api/ModuleContentController.php`](app/Http/Controllers/Api/ModuleContentController.php:84) gibi controller’lar sadece `seo_title` ve `seo_description` döndürüyor.
- Frontend sayfalarının çoğu [`SeoManager`](frontend/src/components/seo/SeoManager.tsx:62) kullanmıyor.

Sonuç:
- bazı sayfalar default title’a düşüyor,
- bazıları geç güncelleniyor,
- bazıları hiç özel meta uygulamıyor.

## CP tarafında SEO nereden yönetiliyor?

### Global varsayılanlar
- [`content/globals/seo.yaml`](content/globals/seo.yaml:1)
  - `default_title`
  - `default_description`
  - `default_keywords`
  - `default_og_image`
  - `site_name`
  - `twitter_handle`

### Sayfa bazlı alanlar
- Örnek: [`content/collections/pages/neden-lioxerp.md`](content/collections/pages/neden-lioxerp.md:33)
  - `seo_title`
  - `seo_description`
  - ayrıca canonical / robots / og alanları blueprint’te varsa onlar da

### Modül / sektör / blog / etkinlik / haber
İlgili entry dosyaları veya collection blueprint’lerinde ayrı ayrı tutuluyor. Backend controller’lar bunları okuyor ama henüz ortak `resolved_seo` formatında normalize etmiyor.

## Neden bazı sayfalar “tak diye”, bazıları “Yükleniyor” geliyor?

### Hızlı açılanlar
- [`frontend/src/pages/Home.tsx`](frontend/src/pages/Home.tsx:19)
  - `window.__LIOX_HOME_PAGE_CONTENT__`
  - `localStorage` cache

### Yükleniyor hissi verenler
- [`frontend/src/pages/GenericPage.tsx`](frontend/src/pages/GenericPage.tsx:24)
  - veri `useEffect` sonrası çekiliyor
- [`frontend/src/pages/EventsPage.tsx`](frontend/src/pages/EventsPage.tsx:46)
  - veri boş başlayıp sonra doluyor

### Önemli ayrım
Her API sayfası aynı değil:
- bazıları loading skeleton gösteriyor,
- bazıları cache kullanıyor,
- bazıları sadece boş state üstüne veri yazıyor.

## Hedef standart

Tüm içerik tipleri şu yapıya gelmeli:

### Backend
Her detail/list endpoint şu alanları dönmeli:
- `seo_title`
- `seo_description`
- `canonical_url`
- `robots`
- `og_title`
- `og_description`
- `og_image`
- `x_title`
- `x_description`
- `x_handle`
- `resolved_seo`
- `structured_data`

### Frontend
Her SEO kritik sayfa [`SeoManager`](frontend/src/components/seo/SeoManager.tsx:62) kullanmalı.

## Uygulama sırası

### 1. Backend standardizasyonu
Şu controller’lara `resolved_seo` eklenmeli:
- [`app/Http/Controllers/Api/ModuleContentController.php`](app/Http/Controllers/Api/ModuleContentController.php:10)
- [`app/Http/Controllers/Api/SectorContentController.php`](app/Http/Controllers/Api/SectorContentController.php:1)
- [`app/Http/Controllers/Api/BlogContentController.php`](app/Http/Controllers/Api/BlogContentController.php:1)
- [`app/Http/Controllers/Api/EventContentController.php`](app/Http/Controllers/Api/EventContentController.php:1)
- [`app/Http/Controllers/Api/NewsContentController.php`](app/Http/Controllers/Api/NewsContentController.php:1)
- [`app/Http/Controllers/Api/TestimonialContentController.php`](app/Http/Controllers/Api/TestimonialContentController.php:1)

### 2. Frontend SEO uygulaması
Şu sayfalara `SeoManager` bağlanmalı:
- [`frontend/src/pages/ModulePage.tsx`](frontend/src/pages/ModulePage.tsx:43)
- [`frontend/src/pages/SectorLanding.tsx`](frontend/src/pages/SectorLanding.tsx:306)
- [`frontend/src/pages/Blog.tsx`](frontend/src/pages/Blog.tsx:53)
- [`frontend/src/pages/BlogPost.tsx`](frontend/src/pages/BlogPost.tsx:51)
- [`frontend/src/pages/BlogCategory.tsx`](frontend/src/pages/BlogCategory.tsx:37)
- [`frontend/src/pages/EventsPage.tsx`](frontend/src/pages/EventsPage.tsx:42)
- [`frontend/src/pages/EventDetailPage.tsx`](frontend/src/pages/EventDetailPage.tsx:55)
- [`frontend/src/pages/NewsPage.tsx`](frontend/src/pages/NewsPage.tsx:19)
- [`frontend/src/pages/NewsDetailPage.tsx`](frontend/src/pages/NewsDetailPage.tsx:22)
- [`frontend/src/pages/TestimonialsPage.tsx`](frontend/src/pages/TestimonialsPage.tsx:18)
- [`frontend/src/pages/Contact.tsx`](frontend/src/pages/Contact.tsx:19)
- [`frontend/src/pages/ThankYouPage.tsx`](frontend/src/pages/ThankYouPage.tsx:5)

### 3. CP / Blueprint standardı
Tüm SEO kritik blueprint’lerde şu alanlar ortaklaştırılmalı:
- `seo_title`
- `seo_description`
- `canonical_url`
- `robots`
- `og_title`
- `og_description`
- `og_image`
- `x_title`
- `x_description`
- `x_handle`

## Kısa sonuç

Şu an generic sayfalar kötü değil; asıl eksik, **diğer sayfaların generic kadar standart SEO akışına sahip olmaması**.

Doğru çözüm:
- generic’i bozmak değil,
- tüm diğer sayfaları da generic kadar disiplinli hale getirmek.
