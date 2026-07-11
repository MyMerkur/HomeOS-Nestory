# Nestory-Web

Nestory'nin tanıtım web sitesi. Next.js (App Router) ile statik export olarak
üretilir ve `nestoryhomekit.com` üzerinde OpenLiteSpeed/CyberPanel altında
statik dosya olarak yayınlanır.

## Diller

- Türkçe (varsayılan, prefix'siz): `/`, `/destek`, `/privacy`, `/terms`
- İngilizce: `/en`, `/en/support`, `/en/privacy`, `/en/terms`
- Çekçe: `/cs`, `/cs/podpora`, `/cs/privacy`, `/cs/terms`

Route'lar `src/app/(tr)`, `src/app/(en)`, `src/app/(cs)` route group'ları
altında tanımlıdır (her biri kendi kök layout'una ve `<html lang>` değerine
sahiptir). Sayfa metinleri `src/content/{tr,en,cs}.ts` içindedir.

## Geliştirme

```bash
npm install
npm run dev
```

## Build (statik export)

```bash
npm run build
```

Çıktı `out/` klasörüne üretilir — herhangi bir statik dosya sunucusuna
kopyalanabilir. `next.config.ts` içinde `output: "export"` ayarlıdır; bu
nedenle middleware, rewrites, image optimization gibi sunucu gerektiren
özellikler kullanılmaz.

## Deploy

`docs/Deployment.md` içindeki "Nestory-Web VPS deploy" bölümüne bakın.
