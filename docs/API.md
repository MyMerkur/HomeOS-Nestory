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
| Auth | POST /api/auth/register | Kullanıcı kaydı | ⏳ |
| Auth | POST /api/auth/login | Access + refresh token | ⏳ |
| Auth | POST /api/auth/refresh | Access token yeniler | ⏳ |
| Auth | POST /api/auth/logout | Refresh token invalid eder | ⏳ |
| Home | POST /api/homes | Yeni ev oluşturur | ⏳ |
| Home | GET /api/homes | Kullanıcının evlerini listeler | ⏳ |
| Home | POST /api/homes/join | Davet koduyla eve katılır | ⏳ |
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

## Pagination

```
GET /api/homes/:homeId/items?locationId=&category=&status=active&expiryWindow=7d&search=milk&page=1&limit=20&sort=expiryDate:asc
```

```json
{ "items": [], "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 } }
```

Yeni endpoint eklendikçe bu tablo ve ilgili request/response örnekleri güncellenmelidir.
