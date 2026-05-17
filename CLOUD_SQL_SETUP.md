# Cloud SQL Kullanıcı Oluşturma - liox_app

## ⚠️ Ön Koşul
Bu komutları çalıştırmadan önce aşağıdaki değerleri kendi projenize göre güncelleyin:
- `PROJECT_ID` → Google Cloud proje ID'niz
- `REGION` → Cloud SQL instance bölgeniz (ör: `europe-west1`)
- `INSTANCE_NAME` → Cloud SQL instance adınız (ör: `liox-mysql`)

---

## 1. liox_app Kullanıcısını Oluşturma

### Seçenek A: Şifreyi komut ile birlikte verme
```bash
gcloud sql users create liox_app \
  --instance=INSTANCE_NAME \
  --password=ŞİFRE_NİZ_BURAYA
```

### Seçenek B: Şifreyi interaktif olarak alma
```bash
gcloud sql users create liox_app \
  --instance=INSTANCE_NAME
```
> Bu komut çalıştırıldığında şifre girmeniz istenecek.

---

## 2. Kullanıcı Yetkilerini Ayarlama

`liox_app` kullanıcısına `liox_production` veritabanı için gerekli yetkileri verin:

```bash
# Cloud SQL Interactive Shell'e bağlan
gcloud sql connect INSTANCE_NAME --user=root
```

Açılan shell'de şu komutları çalıştırın:

```sql
-- liox_production veritabanını seç (yoksa oluştur)
CREATE DATABASE IF NOT EXISTS liox_production;
USE liox_production;

-- liox_app kullanıcısına tüm yetkileri ver
GRANT ALL PRIVILEGES ON liox_production.* TO 'liox_app'@'%';
FLUSH PRIVILEGES;
```

---

## 3. .env Dosyasını Güncelleme

`.env` dosyasını Cloud SQL bağlantısı için güncelleyin:

```bash
# SQLite yerine Cloud SQL'e geç
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=liox_production
DB_USERNAME=liox_app
DB_PASSWORD=ŞİFRE_NİZ_BURAYA

# Unix socket (Cloud Run'da) - DB_HOST boş olmalı
# DB_HOST=
# DB_SOCKET=/cloudsql/PROJECT_ID:REGION:liox-mysql
```

### Cloud Run için .env Değişkenleri:
```bash
# Cloud Run'da Unix Socket kullanımı
DB_CONNECTION=mysql
DB_HOST=
DB_SOCKET=/cloudsql/PROJECT_ID:REGION:liox-mysql
DB_DATABASE=liox_production
DB_USERNAME=liox_app
DB_PASSWORD=ŞİFRE_NİZ_BURAYA
```

---

## 4. Cloud Run Service Account Yetkileri

Cloud Run service account'unun Cloud SQL'e erişimi olduğundan emin olun:

```bash
# Cloud Run service account'unu bul
gcloud run services describe liox-statamic --region=REGION --format='value(serviceAccountEmail)'

# Cloud SQL Client rolü ver
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:CLOUD_RUN_SERVICE_ACCOUNT" \
  --role="roles/cloudsql.client"
```

---

## 5. Bağlantı Testi

Kullanıcı oluşturulduktan sonra bağlantıyı test edin:

```bash
# MySQL client ile test
mysql -h INSTANCE_NAME --ssl-mode=REQUIRED -u liox_app -p liox_production
```

---

## Kullanıcı Oluşturma Komutu (Tek Satır)

```bash
# PROJECT_ID ve INSTANCE_NAME değerlerini güncelleyin
gcloud sql users create liox_app --instance=liox-mysql --password=GEÇICI_ŞİFRE
```

Ardından SQL shell'de:
```sql
CREATE DATABASE IF NOT EXISTS liox_production;
GRANT ALL PRIVILEGES ON liox_production.* TO 'liox_app'@'%';
FLUSH PRIVILEGES;
```
