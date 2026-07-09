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
| Inventory | GET /api/homes/:homeId/items/barcode-lookup/:barcode | Open Food Facts üzerinden ürün adı/kategori otomatik doldurma | ✅ |
| Inventory | GET/PATCH/DELETE /api/homes/:homeId/items/:itemId | Detay / güncelle / sil | ✅ |
| Inventory | POST /api/homes/:homeId/items/:itemId/{consume,discard,freeze,add-to-shopping} | Durum aksiyonları | ✅ |
| Shopping | GET/POST /api/homes/:homeId/shopping/items | Filtreli liste / ekleme | ✅ |
| Shopping | PATCH/DELETE /api/homes/:homeId/shopping/items/:itemId | Güncelle / sil | ✅ |
| Shopping | PATCH /api/homes/:homeId/shopping/items/:itemId/check | İşaretle/kaldır (toggle) | ✅ |
| Recipes | GET /api/homes/:homeId/recipes/suggestions | Tarif eşleşmeleri | ✅ |
| Recipes | GET /api/homes/:homeId/recipes/saved | Kaydedilen tarifler (ev geneli) | ✅ |
| Recipes | POST/DELETE /api/homes/:homeId/recipes/:recipeId/save | Tarif kaydet / kaldır | ✅ |
| Notifications | — | Yerel bildirim (mobile-only, backend endpoint yok — bkz. docs/ProjectDecisions.md) | ✅ |
| Gamification | GET /api/homes/:homeId/badges | Rozet ilerlemesi (canlı hesaplanır) | ✅ |
| Assets | GET/POST /api/homes/:homeId/assets | Filtreli liste / ekleme (v2, gıda dışı envanter) | ✅ |
| Assets | GET/PATCH/DELETE /api/homes/:homeId/assets/:assetId | Detay / güncelle / sil | ✅ |
| Assets | POST /api/homes/:homeId/assets/:assetId/{receipt,warranty-document} | Fiş/garanti belgesi fotoğrafı yükleme | ✅ |

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
?locationId=&category=&status=active&expiryWindow=7d&search=milk&barcode=&page=1&limit=20&sort=expiryDate:asc
```

```json
{ "items": [{ "id", "name", "category", "quantity", "unit", "locationId", "expiryDate", "status", "..." }],
  "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 } }
```

- `expiryWindow`: `"7d"` formatında — `expiryDate <= now + 7 gün` olan ürünleri getirir.
- `search`: Türkçe karakter normalize edilerek `normalizedName` üzerinde regex araması yapar.
- `barcode`: tam eşleşme — mobile'ın barkod tarama POC'unda daha önce aynı barkodla
  eklenmiş bir ürünü bulup ad/kategori/birim önermek için kullanılır.
- `sort`: `"<alan>:asc|desc"` formatında, verilmezse `createdAt:desc`.

### POST /api/homes/:homeId/items

```json
// Request
{ "name": "Kaşar Peyniri", "locationId": "...", "category": "Dairy", "quantity": 1, "unit": "piece", "expiryDate": "2026-07-10" }
```

`category` ve `unit` sabit enum'lardır (`server/src/constants/inventory.ts`).
`locationId` bu home'a ait değilse `400 INVALID_LOCATION`.

`category: 'Medicine'` için opsiyonel `doseAmount` (number) ve `doseTimes`
(`"HH:mm"` string dizisi, ör. `["09:00", "21:00"]`) alanları da kabul edilir —
diğer kategorilerde anlamsızdır ama şema seviyesinde reddedilmez.

### GET /api/homes/:homeId/items/barcode-lookup/:barcode

`requireHomeMembership('viewer')`. Mobil, barkod tarandığında önce evin kendi
envanterinde (`GET .../items?barcode=`) eşleşme arar; bulamazsa bu endpoint'i
çağırır. Sunucu tarafında arama sırası (`server/src/services/
productLookupService.ts`):

1. **`ProductCatalog` koleksiyonu** (kendi veritabanımız, ev-bağımsız/global) —
   anında, dış servise hiç gitmeden döner.
2. Orada yoksa [Open Food Facts](https://world.openfoodfacts.org) API'sine
   proxy yapılır (API anahtarı gerektirmez, 5 saniyelik timeout, ağ hatasında
   sessizce `null`'a düşer). Bulunursa sonuç `ProductCatalog`'a
   `source: "openfoodfacts"` olarak cache'lenir — aynı barkod bir daha
   sorulduğunda dış servise hiç gidilmez.
3. Hiçbirinde yoksa `{ "product": null }` döner; mobil kullanıcıya manuel
   giriş formunu sunar. Kullanıcı formu doldurup ürünü oluşturursa
   (`inventoryService.createItem`), girdiği barkod/ad/kategori/birim
   otomatik olarak `source: "user"` ile `ProductCatalog`'a yazılır
   (`recordUserProvidedProduct`, "ilk yazan kazanır" — mevcut bir kaydın
   üzerine yazmaz). Böylece bir ev bir barkodu bir kez elle girdiğinde,
   **başka bir ev aynı barkodu taradığında** otomatik dolduruluyor — kapsam
   uygulamanın kullanımıyla birlikte büyür.

```json
// 200 — bulundu
{ "success": true, "data": { "product": {
  "barcode": "3017620425035", "name": "Nutella", "brand": "Nutella",
  "category": "Other", "unit": null, "imageUrl": "https://..."
} } }
// 200 — bulunamadı
{ "success": true, "data": { "product": null } }
```

`category` eşleşmesi Open Food Facts `categories_tags` alanındaki anahtar
kelimelere göre yapılan kaba bir haritalama (`CATEGORY_TAG_MAP`); eşleşme
bulunamazsa `null` döner ve kullanıcı formda kategori seçer. `unit`, Open
Food Facts'ten hiç gelmez (serbest metin `quantity` alanından güvenilir
ayrıştırma yapılmıyor) — yalnızca daha önce bir kullanıcının elle girdiği
kayıtlarda dolu olur. Open Food Facts'in ücretsiz katmanı yalnızca gıda
ürünleriyle sınırlı (temizlik/elektronik gibi gıda-dışı ürünlerde
çoğunlukla `null` döner) — bu durumda kapsamı büyüten tek mekanizma
yukarıdaki kullanıcı-kaynaklı kataloglama.

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
POST /api/homes/:homeId/items/:itemId/take-dose
```

- `consume/discard/freeze`: item'ın `status`'unu sırasıyla `consumed/discarded/frozen` yapar,
  `AuditLog` kaydı üretir. Item zaten hedef status'taysa `400 INVALID_STATUS_TRANSITION`.
- `freeze`: yalnızca `status` değişir, `locationId` **değişmez** (kullanıcı kararı — MVP'de
  otomatik lokasyon taşıma yok).
- `add-to-shopping`: item'ın `status`'unu **değiştirmez**; ürün adı/birim/kategorisiyle
  home'un varsayılan alışveriş listesine yeni bir `ShoppingItem` ekler (bkz. Shopping
  endpointleri) ve `metadata.shoppingItemId` ile ilişkilendirilmiş bir `AuditLog` kaydı üretir.
- `take-dose` (v1.3, İlaç modülü): yalnızca `category: 'Medicine'` olan item'larda
  çalışır, aksi halde `400 NOT_A_MEDICINE`. `quantity`'yi `doseAmount` (belirtilmemişse
  `1`) kadar azaltır, `0`'ın altına düşürmez (`Math.max(0, ...)`). `status`'u
  **değiştirmez** — `consume/discard/freeze`'in aksine tekrarlanabilir bir aksiyondur
  (ilaç yenilenip stok tekrar dolabilir), tek seferlik bir durum geçişi değildir.
  `metadata.quantityAfter` ile bir `AuditLog` kaydı (`action: 'dose_taken'`) üretir.

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
      "instructions": ["Biber ve domatesi zeytinyağında kavurun.", "..."],
      "isSaved": false
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
- `isSaved`, evin `SavedRecipe` kayıtlarına bakılarak hesaplanır.

### GET /api/homes/:homeId/recipes/saved

`requireHomeMembership('viewer')` ile korunur. Aynı `recipes` şeklini döner
(`isSaved` her zaman `true`), ancak `coveragePercent > 0` filtresi **uygulanmaz** —
kaydedilen bir tarif, o an malzemesi evde olmasa da listede kalır. Sıralama isme göre
alfabetiktir (kapsama sırası değil).

### POST/DELETE /api/homes/:homeId/recipes/:recipeId/save

`requireHomeMembership('member')` ile korunur (yazma aksiyonu — diğer
`POST`/`PATCH`/`DELETE` endpoint'leriyle aynı rol eşiği). Her iki uç da idempotenttir:
zaten kaydedilmiş bir tarifi tekrar kaydetmek veya kaydedilmemiş bir tarifi kaldırmak
hata döndürmez. Kaydetme **ev geneli/paylaşımlıdır** — kullanıcıya özel değildir, ev
üyelerinden biri kaydettiğinde tüm üyeler görür.

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

## Asset (v2 Warranty/Documents) endpoint detayları

Tüm asset endpointleri `requireHomeMembership` ile korunur: GET için `viewer`,
POST/PATCH/DELETE için `member`.

### GET /api/homes/:homeId/assets

```
?status=active&category=Electronics&page=1&limit=20&sort=warrantyEndDate:asc
```

```json
{ "assets": [{ "id", "name", "category", "room", "brand", "purchaseDate", "price", "warrantyEndDate", "receiptImageUrl", "warrantyDocumentUrl", "status", "..." }],
  "pagination": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 } }
```

### POST /api/homes/:homeId/assets

```json
{ "name": "Televizyon", "category": "Electronics", "room": "Oturma Odası", "warrantyEndDate": "2028-01-01" }
```

`category` sabit bir enum'dur (`server/src/constants/asset.ts`). `room` serbest
metindir — ayrı bir lokasyon modeli/CRUD'u yok.

### GET/PATCH/DELETE /api/homes/:homeId/assets/:assetId

Body'deki her alan PATCH'te opsiyoneldir. `status` (`active`/`archived`) genel
PATCH'e dahildir — Inventory'nin aksine assets için audit log yok, bu yüzden
ayrı bir aksiyon endpoint'i gerekmiyor. `receiptImageUrl`/`warrantyDocumentUrl`
bu endpoint'ten **ayarlanamaz** — yalnızca aşağıdaki upload endpoint'leri
üzerinden set edilir.

### POST /api/homes/:homeId/assets/:assetId/receipt
### POST /api/homes/:homeId/assets/:assetId/warranty-document

`multipart/form-data`, dosya alanı adı `file`. Yalnızca `image/*` mimetype kabul
edilir, 5MB üst sınır (`server/src/middlewares/upload.ts`). Dosya
`server/uploads/receipts/` altına kaydedilir ve `/uploads/receipts/<dosya>`
yoluyla statik olarak sunulur (`server/src/app.ts`). Geçersiz dosya türü/boyutu
`400 UPLOAD_ERROR`, dosya eksikse `400 FILE_REQUIRED` döner. Response:
`{ "asset": {...} }` (güncellenmiş `receiptImageUrl`/`warrantyDocumentUrl` ile).

## Membership (Aile) endpoint detayları

`GET` için `viewer`, üye çıkarma için `admin`, ev adı/davet kodu değişikliği
için `owner` rolü gerekir (`requireHomeMembership`).

### GET /api/homes/:homeId/members

```json
{ "members": [{ "membershipId", "userId", "name", "email", "avatarUrl", "role", "joinedAt" }] }
```

### DELETE /api/homes/:homeId/members/:userId

Owner rolündeki üye çıkarılamaz — `400 CANNOT_REMOVE_OWNER`. Hedef üye aktif
değilse `404 MEMBER_NOT_FOUND`.

### POST /api/homes/:homeId/leave

Kendi üyeliğinden ayrılma. Owner, evde başka aktif üye varken ayrılamaz —
`400 OWNER_CANNOT_LEAVE` (ownership devri özelliği yok). Owner tek aktif üyeyse
ayrılabilir.

### PATCH /api/homes/:homeId

```json
{ "name": "Yeni Ev Adı" }
```

Sadece owner. Response: `{ "home": { "id", "name" } }`.

### POST /api/homes/:homeId/invite-code/regenerate

Sadece owner. Eski kod hash'i geri getirilemediği için (yalnızca hash
saklanıyor) yeni bir kod üretilip eskisinin yerine geçer. Response:
`{ "inviteCode": "..." }` (düz metin, sadece bu response'ta görünür).

## Kullanıcı (Ayarlar) endpoint detayları

Tümü `authenticate` ile korunur, `:userId` yerine her zaman oturum sahibi
(`req.userId`) kullanılır — başka bir kullanıcının profilini görüntüleme/
düzenleme endpoint'i yoktur.

### GET /api/users/me

```json
{ "user": { "id", "name", "email", "avatarUrl", "settings": { "language", "theme", "notificationPreferences": { "expiryReminders", "shoppingUpdates", "weeklySummary", "reminderDaysBefore", "dailyReminderEnabled", "dailyReminderHour" } } } }
```

### PATCH /api/users/me

```json
{ "name": "Yeni İsim", "avatarUrl": "https://..." }
```

Her iki alan da opsiyoneldir.

### PATCH /api/users/me/password

```json
{ "currentPassword": "...", "newPassword": "..." }
```

Yanlış mevcut şifre `401 INVALID_CURRENT_PASSWORD` döner.

### PATCH /api/users/me/settings

```json
{ "language": "tr", "theme": "light", "notificationPreferences": { "expiryReminders": false } }
```

`language` yalnızca desteklenen 8 dil kodundan birini kabul eder: `en`, `tr`,
`de`, `fr`, `es`, `it`, `cs`, `pt` (Sprint 13, i18n initiative). Başka bir
değer zod validasyonunda `422 VALIDATION_ERROR` ile reddedilir.

`theme` artık `"light"`, `"dark"`, `"system"` değerlerinin tamamını kabul
eder (Sprint 14.1, dark mode initiative — önceki v1 sınırı kaldırıldı).
Başka bir değer zod validasyonunda `422 VALIDATION_ERROR` ile reddedilir.
`notificationPreferences` kısmi güncellenebilir (verilmeyen alanlar korunur).
`reminderDaysBefore` (SKT hatırlatma eşikleri, varsayılan `[7,3,1,0]`),
`dailyReminderEnabled` ve `dailyReminderHour` (0-23, varsayılan `9`) Sprint 16.1
(bildirim initiative) ile eklendi.

### POST /api/users/me/push-tokens

```json
{ "token": "<FCM cihaz token'ı>", "platform": "ios" }
```

`platform` yalnızca `"ios"` veya `"android"` kabul eder. Aynı `token` tekrar
gönderilirse upsert edilir (yeni kayıt oluşmaz). `201` döner.

### DELETE /api/users/me/push-tokens/:token

Oturum sahibine ait belirtilen push token'ı siler (örn. logout akışında).
Token bulunamasa da `200` döner (idempotent).

Push gönderimi `server/src/services/pushService.ts`'teki `sendToUser()` ile
yapılır — Firebase Admin SDK kimlik bilgisi (`FIREBASE_SERVICE_ACCOUNT` env
değişkeni) ayarlanmadığı sürece bu fonksiyon sessizce no-op'tur (bkz.
`docs/ProjectDecisions.md`, Sprint 16.2).

## Pagination

```
GET /api/homes/:homeId/items?locationId=&category=&status=active&expiryWindow=7d&search=milk&page=1&limit=20&sort=expiryDate:asc
```

```json
{ "items": [], "pagination": { "page": 1, "limit": 20, "total": 143, "totalPages": 8 } }
```

Yeni endpoint eklendikçe bu tablo ve ilgili request/response örnekleri güncellenmelidir.
