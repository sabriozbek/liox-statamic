# LioX Frontend SSR Migration Plan

## Hedef

- İlk yüklemede dolu HTML
- Güçlü SEO
- Statamic CP'den yönetilen içeriklerin render edilmesi
- Cloud Run üzerinde SSR runtime

## Mevcut stack

- [`react`](package.json:25)
- [`react-router`](package.json:29)
- [`vite`](package.json:46)
- şu an yalnızca SPA build: [`build`](package.json:8)

Bu yüzden en düşük kırıcı çözüm:

## Tercih edilen yol: Vite SSR

Neden?
- mevcut React kod tabanını korur
- route yapısını yeniden yazmayı azaltır
- CP/API içeriği server-side fetch edilebilir
- Cloud Run'da Node runtime ile çalışır

## Yapılacak ana değişiklikler

### 1. Uygulama girişini client/server ayır

Yeni dosyalar:
- `src/entry-client.tsx`
- `src/entry-server.tsx`
- `src/app-router.tsx`

Amaç:
- client hydration
- server render

### 2. Router yapısını SSR uyumlu hale getir

Şu an [`App.tsx`](src/App.tsx:67) içinde route ağacı var.
Bu route ağacı ayrı export edilmeli ki server render sırasında da kullanılabilsin.

### 3. Sayfa başına loader/fetch standardı kur

Bugün çoğu sayfa `useEffect` ile fetch ediyor.

SSR için:
- route bazlı veri yükleme fonksiyonları tanımlanmalı
- aynı fonksiyon hem server’da hem client’da kullanılmalı

Örnek hedef yapı:
- `getHomePageContent()`
- `getPageContent(slug)`
- `getModuleBySlug(slug)`
- `getSectorBySlug(slug)`

Bu fonksiyonlar SSR request sırasında çağrılmalı.

### 4. SEO verisini aynı payload içinde dön

Backend hedefi:
- tüm page/detail endpointleri `resolved_seo` dönmeli

Frontend hedefi:
- SSR sırasında `SeoManager` yerine head verisi doğrudan server response’a gömülebilmeli
- hydration sonrası `SeoManager` bunu korumalı

### 5. Cloud Run için Node SSR server ekle

Yeni dosya örnekleri:
- `server.ts`
- production node server bootstrap

Bu server:
- gelen URL'yi alır
- ilgili route datasını çeker
- HTML render eder
- client bundle’ı hydrate eder

### 6. Dockerfile değişecek

Şu an [`frontend/Dockerfile`](Dockerfile:15) Nginx static serving yapıyor.

SSR sonrası:
- runtime Nginx değil Node olacak
- `npm run build:ssr`
- `node server.js`

## İçerik yönetimi bozulur mu?

Hayır.

Çünkü içerik kaynağı yine Statamic olacaktır:
- pages
- modules
- sectors
- blog
- news
- events

CP sadece içeriği düzenler.
SSR sadece içeriğin ne zaman render edildiğini değiştirir.

## Aşamalı geçiş planı

### Faz 1
- route ağacını SSR uyumlu hale getir
- home + generic pages SSR

### Faz 2
- module / sector / blog / news / events detail sayfaları SSR

### Faz 3
- shared SEO payload
- head management standardı

### Faz 4
- Cloud Run node SSR deploy

## Beklenen kazanım

- ana sayfa ilk byte'da dolu gelir
- generic sayfalar title sonradan yazılmaz
- SEO botları tam HTML görür
- CP içeriği editlenmeye devam eder

## Not

Bu geçiş "küçük patch" değil, mimari refactor'dur.
Ama mevcut stack için en mantıklı ve sürdürülebilir yol budur.
