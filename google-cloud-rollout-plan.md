# LioXERP Google Cloud Canlı Geçiş Yol Haritası

## 1. Hedef Mimari

- Frontend hosting: Firebase Hosting veya Cloud CDN
- Backend: Google Cloud Run
- Veritabanı: Cloud SQL MySQL
- Queue / cache: Redis için Memorystore veya yönetilen Redis
- Statamic / Laravel app: tek container
- Asset / medya: Google Cloud Storage veya optimize edilmiş public asset katmanı

## 2. Referans `liox 1` ile Ortak Mantık

Referans dağıtım mantığı şu dosyalarda görülüyor:

- [`liox 1/deploy.sh`](liox 1/deploy.sh:1)
- [`liox-statamic/.github/workflows/deploy.yml`](liox-statamic/.github/workflows/deploy.yml:1)

Referans yaklaşım:

- backend ayrı deploy
- frontend ayrı build/deploy
- env değerleri deploy sırasında inject

## 3. Bu Proje İçin Önerilen Canlı Mimarisi

### Frontend

- Vite build alınır
- Firebase Hosting veya Cloud CDN arkasına verilir
- statik assetler long-cache ile servis edilir

### Backend

- Laravel + Statamic uygulaması Cloud Run'a çıkar
- container port: `8080`
- `APP_ENV=production`
- `APP_DEBUG=false`

### Database

- SQLite yerine Cloud SQL MySQL kullanılır
- mevcut workflow zaten MySQL hedefliyor: [`deploy.yml`](liox-statamic/.github/workflows/deploy.yml:151)

### Cache / Queue

- Queue için `database` yerine Redis/Horizon önerilir
- yüksek trafik için Memorystore bağlanır

## 4. Canlı Öncesi SEO Checklist

- Global default SEO: [`content/globals/seo.yaml`](liox-statamic/content/globals/seo.yaml:1)
- Home SEO: [`content/collections/pages/home.md`](liox-statamic/content/collections/pages/home.md:215)
- Sayfa bazlı SEO alanları normalize edilmeli
- canonical URL'ler production domain ile eşleşmeli
- tek sitemap URL bırakılmalı
- Search Console'a sadece tek sitemap verilmeli

## 5. Canlı Öncesi Performans Checklist

- Static cache: [`config/statamic/static_caching.php`](liox-statamic/config/statamic/static_caching.php:15)
- Warm komutları deploy sonrasında:
  - [`php artisan config:cache`](liox-statamic/artisan)
  - [`php artisan route:cache`](liox-statamic/artisan)
  - [`php artisan view:cache`](liox-statamic/artisan)
  - [`php artisan statamic:stache:warm`](liox-statamic/artisan)
- Nginx güvenlik ve cache ayarları: [`docker/nginx.conf`](liox-statamic/docker/nginx.conf:1)
- Frontend build chunk optimizasyonu: [`frontend/vite.config.ts`](liox-statamic/frontend/vite.config.ts)

## 6. Canlı Öncesi Güvenlik Checklist

- [`APP_DEBUG=false`](liox-statamic/.env:4)
- reCAPTCHA anahtarları doldurulmalı: [`RECAPTCHA_V3_SITE_KEY`](liox-statamic/.env:55)
- rate limit aktif kalmalı: [`routes/api.php`](liox-statamic/routes/api.php:29)
- admin log aktif: [`config/admin-log.php`](liox-statamic/config/admin-log.php:1)
- roller / kullanıcı grupları kontrol edilmeli: [`resources/users/roles.yaml`](liox-statamic/resources/users/roles.yaml:1)

## 7. Gerekli Secret / Env Listesi

### Uygulama

- `APP_KEY`
- `APP_URL`
- `APP_ENV`
- `APP_DEBUG`

### Database

- `DB_CONNECTION=mysql`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

### Mail

- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_FROM_ADDRESS`
- `MAIL_FROM_NAME`

### CRM

- `CRM_LOGIN_URL`
- `CRM_SAVE_URL`
- `CRM_USERNAME`
- `CRM_PASSWORD`

### Analytics / Tracking

- `GA_MEASUREMENT_ID`
- `VITE_RECAPTCHA_V3_SITE_KEY`
- `RECAPTCHA_V3_SITE_KEY`
- `RECAPTCHA_V3_SECRET_KEY`

## 8. CRM Bilgileri Nereye Girilecek?

Şu an CRM bağlantısı CP'den değil env/config üzerinden çalışıyor.

İlgili yerler:

- env: [`CRM_LOGIN_URL`](liox-statamic/.env:41), [`CRM_SAVE_URL`](liox-statamic/.env:42), [`CRM_USERNAME`](liox-statamic/.env:43), [`CRM_PASSWORD`](liox-statamic/.env:44)
- config: [`config/services.php`](liox-statamic/config/services.php:1)

Canlıda bunlar GitHub Actions secrets veya Cloud Run env vars olarak girilmeli.

## 9. Dağıtım Sırası

1. Cloud SQL oluştur
2. Cloud Run servis hesabını hazırla
3. Secret Manager / GitHub Secrets tanımla
4. Backend image build et
5. Cloud Run deploy et
6. Migration çalıştır
7. Frontend build al
8. Firebase Hosting / CDN deploy et
9. Search Console doğrulama + sitemap gönder
10. canlı smoke test

## 10. Smoke Test Listesi

- home açılıyor mu
- sektör detay açılıyor mu
- modül detay açılıyor mu
- event detay açılıyor mu
- lead form çalışıyor mu
- assessment form çalışıyor mu
- appointment form çalışıyor mu
- CRM sync düşüyor mu
- mail log oluşuyor mu
- `/sitemap.xml` dönüyor mu
- robots / canonical / title / description doğru mu

## 11. Tavsiye

Bu proje için en temiz üretim modeli:

- frontend: Firebase Hosting
- backend: Cloud Run
- DB: Cloud SQL
- asset/cache: CDN + Statamic static caching

Bu, referans `liox 1` dağıtım mantığına en yakın ve hızlı çalışan kurgu olur.
