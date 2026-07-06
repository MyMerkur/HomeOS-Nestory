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
