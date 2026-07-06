# Architecture

## Yüksek seviye

```
React Native App
  |-- Auth / Onboarding
  |-- Home Dashboard
  |-- Pantry Module
  |-- Shopping Module
  |-- Family Module
  |-- Notification Layer
  |-- Native ML Layer (Android: ML Kit, iOS: Vision)

REST API - Node.js / Express
  |-- Auth Module
  |-- Home Module
  |-- Membership Module
  |-- Inventory Module
  |-- Shopping Module
  |-- Recipe Matching Module
  |-- Notification Scheduler
  |-- Analytics Module
  |-- Audit Log Module

MongoDB
  |-- users, homes, memberships, pantry_locations, inventory_items,
      shopping_lists, shopping_items, recipes, notification_jobs,
      audit_logs, refresh_tokens
```

## Backend mimarisi: klasik MVC (tip bazlı klasörleme)

Handbook'un modül-bazlı önerisinin yerine, bu projede **tip bazlı klasik MVC** kullanılır
(bkz. `docs/ProjectDecisions.md` — 2026-07-05 kararı). Tüm modeller, controller'lar, servisler
ve route'lar kendi ortak klasörlerinde toplanır:

```
server/src/
  config/         env, logger, db connection
  models/         Mongoose modelleri (User.ts, Home.ts, InventoryItem.ts, ...)
  controllers/    HTTP katmanı (authController.ts, inventoryController.ts, ...)
  services/       İş kuralları (authService.ts, inventoryService.ts, ...)
  routes/         Express router tanımları (authRoutes.ts, inventoryRoutes.ts, ...)
  validations/    Zod şemaları (authValidation.ts, inventoryValidation.ts, ...)
  middlewares/    authenticate, requireHomeMembership, errorHandler, rateLimiter
  utils/          apiResponse, ortak yardımcılar
  types/          paylaşılan TS tipleri
  app.ts
  server.ts
```

Akış: `Request -> Route -> Auth Middleware -> Validation -> Controller -> Service -> Model -> Response`

Controller HTTP katmanıdır (request/response, status code); iş kuralı service içinde kalır,
Mongoose modeline doğrudan controller'dan erişilmez. Her home kaynağı için
`requireHomeMembership` kontrolü zorunludur; Mongoose sorgularında `homeId` filtresi unutulmaz.

Dosya adlandırma: `<entity><Type>.ts` (örn. `inventoryController.ts`, `inventoryService.ts`,
`inventoryModel.ts`, `inventoryRoutes.ts`, `inventoryValidation.ts`). Aynı entity'ye ait
dosyalar farklı klasörlerde olsa da adlandırma üzerinden birbirine bağlanır ve kolayca bulunur.

## Mobile modüler kural

```
mobile/src/modules/<module>/
  screens/
  components/
  hooks/
  services/
  schemas/
  types/
```

Akış: `Screen -> Hook -> Service/API -> React Query Cache -> UI State`

Ekrandan doğrudan API çağrısı yapılmaz; hook/service katmanı üzerinden gidilir.

## Modül bağımlılık haritası

```
Auth -> Home -> Membership -> Pantry Locations -> Inventory Items
  -> Expiration Dashboard -> Shopping List -> Recipe Matching -> Analytics
  -> Family Notifications -> Push / Local Notifications

OCR / Barcode -> Quick Add Item -> Inventory Items

Medicine / Warranty / Documents -> Home + Membership + Notification altyapısını yeniden kullanır
```

Kaynak: Engineering Handbook (proje kök dizini dışında saklanan özel doküman) — büyük mimari
kararlar burada da güncellenmelidir.
