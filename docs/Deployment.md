# Deployment

## Nestory-Web VPS deploy

Site: `nestoryhomekit.com` (+ `www.` alias), Hostinger VPS (72.62.76.12),
CyberPanel + OpenLiteSpeed. Linux kullanıcısı: `nesto5570`, docroot
`/home/nestoryhomekit.com/public_html/`.

- Next.js `output: "export"` + `trailingSlash: true` (her rota kendi
  klasöründe `index.html` — düz `.html` dosyası ile aynı isimli RSC
  prefetch klasörü çakışmasın diye; `trailingSlash: false` denendi ve
  LiteSpeed'in dizin bulunca otomatik trailing-slash yönlendirmesi
  `destek.html` dosyasını hiç servis etmeden 404'e düşürdüğü görüldü).
- Deploy: `Nestory-Web/deploy/deploy.sh` — build alır, `deploy/htaccess`
  dosyasını `out/.htaccess` olarak kopyalar, `rsync --delete` ile
  `public_html/`'e senkronize eder, sahiplik/izinleri `nesto5570`'e göre
  düzeltir.
- `.htaccess`: yalnızca eski `privacy.html`/`terms.html`'i yeni
  `/privacy/`-`/terms/` adreslerine 301 ile yönlendiriyor artık (temiz
  URL'ler için ekstra rewrite gerekmiyor — dizin zaten var).
- SSH: bu makineden `~/.ssh/nestory_vps_deploy` (ed25519, parolasız) ile
  `root@72.62.76.12`'ye bağlanılıyor; public key VPS'teki
  `root/.ssh/authorized_keys`'e eklendi (2026-07-11). Başka bir
  makineden deploy edilecekse aynı anahtar oraya da eklenmeli ya da yeni
  bir anahtar üretilip eklenmelidir.
- Doğrulama: `https://nestoryhomekit.com/destek`,
  `https://www.nestoryhomekit.com/privacy`, `/en`, `/cs/podpora` vb.
  dışarıdan 200 (yönlendirmeler dahil) döndüğü doğrulandı.

## VPS düzeni

```
/opt/homeos
  docker-compose.yml
  server/
  nginx/
  backups/
```

Containers: `homeos-api`, `homeos-mongo`, `homeos-nginx`

Domains: `api.domain.com -> Express API`, `status.domain.com -> optional health page`

## Gereksinimler

- SSL (certbot)
- MongoDB volume backup
- `.env` yalnızca sunucuda tutulur (repoya girmez)
- Log rotation

## Backup politikası

- MongoDB günlük dump alınır, en az 7 günlük rotasyon tutulur.
- `/uploads` klasörü varsa ayrıca yedeklenir.
- Release öncesi DB migration / model değişiklikleri not edilir.

## CI Pipeline (GitHub Actions)

1. Install dependencies
2. Lint server
3. Test server
4. Typecheck server
5. Lint mobile
6. Typecheck mobile
7. (Opsiyonel) Android debug build

Branch protection: `main`'e merge için pipeline yeşil olmalı.

## Release Checklist

Store gönderimi öncesi (bkz. `docs/legal/` — taslak olarak işaretli, hukuki inceleme
gerektirir):

- [ ] `docs/legal/PrivacyPolicy.md` ve `docs/legal/TermsOfService.md` hukuk uzmanı
      tarafından gözden geçirildi, gerçek destek e-postası eklendi
- [ ] `docs/legal/StoreListing.md`'deki metinler son haliyle App Store Connect /
      Google Play Console'a girildi; ekran görüntüleri ve app icon eklendi
- [ ] Mobile app sürüm numarası artırıldı (`mobile/package.json`, iOS
      `CFBundleShortVersionString`/`CFBundleVersion`, Android `versionName`/`versionCode`)
- [ ] Changelog/release notları yazıldı
- [ ] `server` ve `mobile` için `npm run lint && npm test` (backend ayrıca `npm run build`)
      son kez yeşil doğrulandı
- [ ] Production `.env` gözden geçirildi (gerçek secret'lar, `CORS_ORIGIN` doğru domain,
      `NODE_ENV=production`)
- [ ] MongoDB backup alındı (bkz. yukarıdaki Backup politikası)
- [ ] Gizlilik politikasında belirtilen kamera/bildirim izin metinleri iOS
      `Info.plist` (`NSCameraUsageDescription`) ve Android manifest ile tutarlı
- [ ] Production build (iOS Archive / Android release APK-AAB) cihazda son kez
      manuel olarak test edildi (golden path: kayıt, ev oluşturma, ürün ekleme,
      bildirim, alışveriş listesi)
