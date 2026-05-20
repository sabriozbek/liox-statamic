# Frontend Rendering Plan

## Mevcut durum

Frontend şu an klasik Vite + React SPA olarak çalışıyor.

Kanıt:
- [`frontend/vite.config.ts`](frontend/vite.config.ts:6) içinde yalnızca client build var.
- SSR, SSG, prerender veya hydration pipeline tanımı yok.
- Sayfalar içeriklerini runtime'da API ile çekiyor.

Bu yüzden ilk yüklemede şu davranış doğal:
- HTML boş veya iskelet gelir
- JS yüklenir
- API çağrısı gider
- içerik sonradan ekrana yazılır

## Neden bazı siteler tak diye açılıyor?

Çünkü genelde şu çözümlerden birini kullanırlar:

1. **SSR (Server-Side Rendering)**
   - HTML sunucuda hazırlanır.
   - Tarayıcı ilk istekte dolu sayfa alır.

2. **SSG / prerender**
   - Build sırasında sayfa HTML'i üretilir.
   - Statik sayfalar doğrudan dolu gelir.

3. **ISR benzeri hibrit yapı**
   - bazı sayfalar önceden hazırlanır,
   - bazıları sonradan güncellenir.

## Bu proje için en doğru seçenek

Senin durumda içerikler Statamic'te dosya tabanlı ve CP'den yönetiliyor.
Bu yüzden en sağlıklı yaklaşım:

### Seçenek A — Prerender (önerilen başlangıç)

Şu sayfalar build sırasında prerender edilebilir:
- `/`
- `/neden-lioxerp`
- `/gizlilik-politikasi`
- `/kullanim-sartlari`
- `/kvkk`
- `/iletisim`
- `/tesekkurler`
- `/sektorler`
- `/modul`
- `/blog`
- `/haber`
- `/etkinlik`

Avantajlar:
- hızlı ilk yükleme
- SEO düzgün HTML içinde gelir
- mevcut Statamic içerik modeli bozulmaz
- CP’den değişen içerikler yeni deploy/build ile güncellenir

Dezavantaj:
- içerik değişince yeniden build gerekir

### Seçenek B — SSR

React tarafını SSR destekli hale getirirsin.

Avantajlar:
- ilk yanıt dolu HTML olur
- SEO çok güçlü olur
- CP değişiklikleri anında server render’a yansır

Dezavantajlar:
- mimariyi ciddi büyütür
- Cloud Run’da node SSR server yönetmek gerekir
- şu anki Vite SPA yapısından daha karmaşık

## Statamic + CP ile birlikte en mantıklı model

### Kısa vadede
- SEO kritik landing ve generic sayfaları **prerender** et
- detay sayfaları API tabanlı kalabilir ama `SeoManager` ile güçlendirilir

### Orta vadede
- blog/modül/sektör detayları için de prerender listesi üret
- Statamic collection slug’larından build-time route map çıkar

### Uzun vadede
- tamamen SSR isteniyorsa frontend’i SSR uyumlu bir yapıya taşı

## CP’den tüm alanlar değiştirilebilir mi?

Evet.

Çünkü veri kaynağı Statamic dosyalarıdır:
- [`content/collections/pages`](content/collections/pages)
- [`content/collections/modules`](content/collections/modules)
- [`content/collections/sectors`](content/collections/sectors)
- [`content/collections/blog`](content/collections/blog)
- [`content/collections/news`](content/collections/news)
- [`content/collections/events`](content/collections/events)

CP sadece bu dosyaları düzenler.

Prerender veya SSR bunu bozmaz.
Sadece render zamanını değiştirir:
- şimdi: browser fetch ediyor
- prerender: build sırasında fetch ediyor
- SSR: request sırasında fetch ediyor

## En net tavsiye

Bu proje için:

1. Önce **SEO standardizasyonunu** tamamla
2. Sonra **prerender** ekle
3. Gerekirse sonra SSR düşün

Çünkü:
- en düşük riskli çözüm prerender
- mevcut Cloud Run mimarisine daha uygun
- Statamic CP içerik modelini bozmaz
- kullanıcıya "tak diye açılan" sayfa hissi verir
