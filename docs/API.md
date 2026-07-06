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
| Home | GET /api/homes/:homeId/dashboard | Özet bilgiler | ⏳ |
| Members | GET /api/homes/:homeId/members | Ev üyeleri | ⏳ |
| Members | PATCH /api/homes/:homeId/members/:memberId | Rol güncelleme | ⏳ |
| Locations | GET/POST /api/homes/:homeId/locations | Lokasyon CRUD | ⏳ |
| Inventory | GET/POST /api/homes/:homeId/items | Filtreli liste / ekleme | ⏳ |
| Inventory | GET/PATCH/DELETE /api/items/:itemId | Detay / güncelle / sil | ⏳ |
| Inventory | POST /api/items/:itemId/{consume,discard,freeze,add-to-shopping} | Durum aksiyonları | ⏳ |
| Shopping | GET /api/homes/:homeId/shopping | Liste | ⏳ |
| Shopping | POST /api/homes/:homeId/shopping/items | Ürün ekle | ⏳ |
| Shopping | PATCH /api/shopping/items/:itemId(/check) | Güncelle / işaretle | ⏳ |
| Recipes | GET /api/homes/:homeId/recipes/suggestions | Tarif eşleşmeleri | ⏳ |
| Notifications | GET/PATCH /api/homes/:homeId/notifications/settings | Bildirim ayarları | ⏳ |

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

## Pagination

```
GET /api/homes/:homeId/items?locationId=&category=&status=active&expiryWindow=7d&search=milk&page=1&limit=20&sort=expiryDate:asc
```

```json
{ "items": [], "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 } }
```

Yeni endpoint eklendikçe bu tablo ve ilgili request/response örnekleri güncellenmelidir.
