# Deployment

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
