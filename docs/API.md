# API

Base path: `/api`

## Response formatı

Success:
```json
{ "success": true, "data": {}, "message": "Operation completed" }
```

Error:
```json
{ "success": false, "data": null, "message": "Validation failed", "error": { "code": "VALIDATION_ERROR", "details": [] } }
```

## Yetki middleware sırası

```
Route -> authenticate -> validateParams -> requireHomeMembership(role?) -> validateBody -> controller
```

## Endpointler (v1 kapsamı, implementasyon ilerledikçe işaretlenecek)

| Modül | Endpoint | Açıklama | Durum |
|---|---|---|---|
| Auth | POST /api/auth/register | Kullanıcı kaydı | ✅ |
| Auth | POST /api/auth/login | Access + refresh token | ✅ |
| Auth | POST /api/auth/refresh | Access token yeniler (rotation) | ✅ |
| Auth | POST /api/auth/logout | Refresh token invalid eder | ✅ |
| Home | POST /api/homes | Yeni ev oluşturur (owner + default locations/shopping list) | ✅ |
| Home | GET /api/homes | Kullanıcının evlerini listeler | ✅ |
| Home | POST /api/homes/join | Davet koduyla eve katılır | ✅ |
| Home | GET /api/homes/:homeId/dashboard | Özet bilgiler | ✅ |
| Members | GET /api/homes/:homeId/members | Ev üyeleri | ⏳ |
| Members | PATCH /api/homes/:homeId/members/:memberId | Rol güncelleme | ⏳ |
| Locations | GET/POST /api/homes/:homeId/locations | Lokasyon listele / oluştur | ✅ |
| Locations | PATCH/DELETE /api/homes/:homeId/locations/:locationId | Lokasyon güncelle / sil | ✅ |
| Inventory | GET/POST /api/homes/:homeId/items | Filtreli liste / ekleme | ✅ |
| Inventory | GET/PATCH/DELETE /api/homes/:homeId/items/:itemId | Detay / güncelle / sil | ✅ |
| Inventory | POST /api/homes/:homeId/items/:itemId/{consume,discard,freeze,add-to-shopping} | Durum aksiyonları | ✅ |
| Shopping | GET/POST /api/homes/:homeId/shopping/items | Filtreli liste / ekleme | ✅ |
| Shopping | PATCH/DELETE /api/homes/:homeId/shopping/items/:itemId | Güncelle / sil | ✅ |
| Shopping | PATCH /api/homes/:homeId/shopping/items/:itemId/check | İşaretle/kaldır (toggle) | ✅ |
| Recipes | GET /api/homes/:homeId/recipes/suggestions | Tarif eşleşmeleri | ✅ |
| Notifications | — | Yerel bildirim (mobile-only, backend endpoint yok — bkz. docs/ProjectDecisions.md) | ✅ |
| Gamification | GET /api/homes/:homeId/badges | Rozet ilerlemesi (canlı hesaplanır) | ✅ |

## Auth endpoint detayları

### POST /api/auth/register

```json
// Request
{ "name": "Dogukan", "email": "dogukan@example.com", "password": "Min8Chars!" }

// Response 201
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Dogukan", "email": "dogukan@example.com" },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Registered successfully"
}
```

Validation: `name` 2-80 karakter, `email` geçerli/unique, `password` min 8 karakter.
Hata: `409 EMAIL_IN_USE` (email zaten kayıtlı).

### POST /api/auth/login

```json
// Request
{ "email": "dogukan@example.com", "password": "Min8Chars!" }
```

Aynı response şekli. Hata: `401 INVALID_CREDENTIALS`.

### POST /api/auth/refresh

```json
// Request
{ "refreshToken": "..." }
```

Rotation uygular: gelen refresh token `revokedAt` ile işaretlenir, yeni bir access+refresh çifti döner.
Kullanılmış/süresi geçmiş/geçersiz token: `401 INVALID_REFRESH_TOKEN`.

### POST /api/auth/logout

```json
// Request
{ "refreshToken": "..." }
```

İlgili refresh token'ı `revokedAt` ile işaretler. `data: null` döner.

Auth endpointleri ayrı bir rate limiter ile korunur (15 dakikada IP başına 20 istek).

## Home endpoint detayları

### POST /api/homes

Auth gerekir (`Authorization: Bearer <accessToken>`).

```json
// Request
{ "name": "My Home", "timezone": "Europe/Istanbul", "defaultCurrency": "TRY" }

// Response 201
{
  "success": true,
  "data": {
    "home": { "id": "...", "name": "My Home", "timezone": "Europe/Istanbul", "defaultCurrency": "TRY", "role": "owner" },
    "inviteCode": "PLFN6LEE"
  },
  "message": "Home created successfully"
}
```

`inviteCode` yalnızca oluşturma anında düz metin olarak döner (DB'de sadece hash'i tutulur).
Otomatik oluşturulanlar: owner Membership, 3 default PantryLocation (Buzdolabı/Dondurucu/Kiler),
1 default ShoppingList.

### GET /api/homes

Kullanıcının aktif üyeliği olan evleri döner: `{ "homes": [{ id, name, timezone, defaultCurrency, role }] }`.

### POST /api/homes/join

```json
// Request
{ "inviteCode": "PLFN6LEE" }
```

Geçersiz kod: `404 INVALID_INVITE_CODE`. Zaten üye: `409 ALREADY_MEMBER`.
Daha önce `removed` olan üyelik varsa `active` role `member` olarak yeniden etkinleşir.

## Location endpoint detayları

Tüm location endpointleri `requireHomeMembership` ile korunur: GET için `viewer`,
POST/PATCH/DELETE için `member` yeterlidir (`docs/Security.md`'deki rol tablosu).

### GET /api/homes/:homeId/locations

`{ "locations": [{ id, name, type, order }] }` — `order` alanına göre sıralı döner.

### POST /api/homes/:homeId/locations

```json
// Request
{ "name": "Temizlik Dolabı", "type": "cabinet" }
```

`type`: `fridge | freezer | pantry | cabinet | medicine | other`. `order` verilmezse
otomatik (mevcut lokasyon sayısı) atanır.

### PATCH /api/homes/:homeId/locations/:locationId

Body'deki her alan opsiyonel (partial update). `404 LOCATION_NOT_FOUND` — id başka home'a aitse de aynı hata döner (izolasyon).

### DELETE /api/homes/:homeId/locations/:locationId

İçinde en az bir `InventoryItem` varsa `409 LOCATION_NOT_EMPTY` (veri kaybını önlemek için).

## Inventory endpoint detayları

Tüm inventory endpointleri `requireHomeMembership` ile korunur: GET için `viewer`,
POST/PATCH/DELETE için `member`. `status` alanı genel PATCH'te **yoktur** — status
değişiklikleri yalnızca aşağıdaki aksiyon endpointleri üzerinden yapılabilir, böylece her
status değişikliği garantili bir `AuditLog` kaydı üretir.

### GET /api/homes/:homeId/items

```
?locationId=&category=&status=active&expiryWindow=7d&search=milk&page=1&limit=20&sort=expiryDate:asc
```

```json
{ "items": [{ "id", "name", "category", "quantity", "unit", "locationId", "expiryDate", "status", "..." }],
  "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 } }
```

- `expiryWindow`: `"7d"` formatında — `expiryDate <= now + 7 gün` olan ürünleri getirir.
- `search`: Türkçe karakter normalize edilerek `normalizedName` üzerinde regex araması yapar.
- `sort`: `"<alan>:asc|desc"` formatında, verilmezse `createdAt:desc`.

### POST /api/homes/:homeId/items

```json
// Request
{ "name": "Kaşar Peyniri", "locationId": "...", "category": "Dairy", "quantity": 1, "unit": "piece", "expiryDate": "2026-07-10" }
```

`category` ve `unit` sabit enum'lardır (`server/src/constants/inventory.ts`).
`locationId` bu home'a ait değilse `400 INVALID_LOCATION`.

### GET/PATCH/DELETE /api/homes/:homeId/items/:itemId

Body'deki her alan PATCH'te opsiyoneldir. Başka home'un ürününe erişim (veya olmayan id)
`404 ITEM_NOT_FOUND` döner — izolasyon `homeId` filtresiyle sağlanır. DELETE şu an hard
delete'tir (audit log Sprint 3'te eklenecek, `docs/Database.md`'de not düşülmüş).

## Expiry Actions endpoint detayları

`requireHomeMembership('member')` ile korunur. Hepsi body almaz.

```
POST /api/homes/:homeId/items/:itemId/consume
POST /api/homes/:homeId/items/:itemId/discard
POST /api/homes/:homeId/items/:itemId/freeze
POST /api/homes/:homeId/items/:itemId/add-to-shopping
```

- `consume/discard/freeze`: item'ın `status`'unu sırasıyla `consumed/discarded/frozen` yapar,
  `AuditLog` kaydı üretir. Item zaten hedef status'taysa `400 INVALID_STATUS_TRANSITION`.
- `freeze`: yalnızca `status` değişir, `locationId` **değişmez** (kullanıcı kararı — MVP'de
  otomatik lokasyon taşıma yok).
- `add-to-shopping`: item'ın `status`'unu **değiştirmez**; ürün adı/birim/kategorisiyle
  home'un varsayılan alışveriş listesine yeni bir `ShoppingItem` ekler (bkz. Shopping
  endpointleri) ve `metadata.shoppingItemId` ile ilişkilendirilmiş bir `AuditLog` kaydı üretir.

Response: `{ "item": {...} }` (add-to-shopping'de ayrıca `"shoppingItem": {...}`).

## Dashboard endpoint detayı

### GET /api/homes/:homeId/dashboard

`requireHomeMembership('viewer')` ile korunur.

```json
{
  "dashboard": {
    "expiringToday": 2,
    "expiringIn3Days": 5,
    "expiringInWeek": 9,
    "totalActive": 41,
    "upcomingItems": [{ "id", "name", "category", "quantity", "unit", "locationId", "expiryDate", "status", "..." }]
  }
}
```

- Sayaçlar yalnızca `status: 'active'` ürünleri kapsar.
- `expiringToday/expiringIn3Days/expiringInWeek` kümülatiftir (`expiringInWeek`, `expiringIn3Days`'i de içerir).
- `upcomingItems`: SKT'si en yakın (ve SKT'si tanımlı) 5 aktif ürün, `expiryDate` artan sırada.

## Shopping endpoint detayları

Tüm shopping endpointleri `requireHomeMembership` ile korunur: GET için `viewer`,
POST/PATCH/DELETE için `member`. Client `listId` göndermez — service, home'un
`isDefault:true` `ShoppingList`'ini otomatik bulur/oluşturur (MVP: ev başına tek ortak liste).

### GET /api/homes/:homeId/shopping/items

```
?status=pending
```

```json
{ "items": [{ "id", "name", "quantity", "unit", "category", "status", "checkedAt", "createdAt", "updatedAt" }] }
```

### POST /api/homes/:homeId/shopping/items

```json
// Request
{ "name": "Süt", "quantity": 2, "unit": "liter", "category": "Dairy" }
```

`quantity/unit/category` opsiyoneldir; `quantity` verilmezse `1` varsayılır.

### PATCH /api/homes/:homeId/shopping/items/:itemId

Body'deki her alan opsiyoneldir (partial update). `404 SHOPPING_ITEM_NOT_FOUND`.

### PATCH /api/homes/:homeId/shopping/items/:itemId/check

Body almaz; `status`'u `pending<->checked` arasında toggle'lar, `checkedAt`'i set/clear eder.

### DELETE /api/homes/:homeId/shopping/items/:itemId

Hard delete.

## Recipes endpoint detayı

### GET /api/homes/:homeId/recipes/suggestions

`requireHomeMembership('viewer')` ile korunur.

```json
{
  "recipes": [
    {
      "id": "...",
      "name": "Menemen",
      "category": "Kahvaltı",
      "imageUrl": null,
      "coveragePercent": 100,
      "missingIngredients": [],
      "ingredients": [{ "name": "Yumurta", "optional": false }, "..."],
      "instructions": ["Biber ve domatesi zeytinyağında kavurun.", "..."]
    }
  ]
}
```

- Kapsama, evin `status: 'active'` `InventoryItem`'larının `normalizedName`'i ile tarifin
  **zorunlu** (`optional: false`) malzemelerinin normalizedName'i karşılaştırılarak
  hesaplanır — AI/LLM kullanılmaz (`docs/Roadmap.md`: "AI olmadan tarif önerisi").
  `optional: true` malzemeler kapsama hesabına dahil edilmez, eksik olsa da listelenmez.
- Sadece `coveragePercent > 0` olan tarifler döner, `coveragePercent` azalan sırada,
  en fazla 10 tarif.
- Tam malzeme/talimat listesi yanıta dahildir — ayrı bir detay endpoint'i yoktur.

## Gamification endpoint detayı

### GET /api/homes/:homeId/badges

`requireHomeMembership('viewer')` ile korunur.

```json
{
  "badges": [
    { "id": "first-item", "name": "İlk Ürün", "description": "Dolabına ilk ürününü ekle.", "target": 1, "progress": 1, "earned": true },
    { "id": "regular-tracker", "name": "Düzenli Takipçi", "description": "10 ürün ekle.", "target": 10, "progress": 3, "earned": false }
  ]
}
```

5 rozet (`server/src/constants/badges.ts`) var olan koleksiyonlardan (InventoryItem/
AuditLog/ShoppingItem/Membership) **canlı hesaplanır** — kalıcı bir "kazanılan rozet"
kaydı tutulmaz (`docs/Database.md`).

## Pagination

```
GET /api/homes/:homeId/items?locationId=&category=&status=active&expiryWindow=7d&search=milk&page=1&limit=20&sort=expiryDate:asc
```

```json
{ "items": [], "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 } }
```

Yeni endpoint eklendikçe bu tablo ve ilgili request/response örnekleri güncellenmelidir.
