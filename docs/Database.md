# Database (MongoDB)

Tüm şemalar `homeId` izolasyonu üzerine kuruludur. Kullanıcı yalnızca üyesi olduğu evin
verisini okuyup değiştirebilir. Her dokümanda `createdAt`/`updatedAt` bulunur; kritik
hareketlerde `createdBy`/`updatedBy` saklanır.

Bu dosya her yeni model/alan eklendiğinde güncellenir (bkz. PR checklist).

## Koleksiyonlar (v1 kapsamı)

- `users`
- `homes`
- `memberships`
- `pantry_locations`
- `inventory_items`
- `shopping_lists`
- `shopping_items`
- `recipes`
- `notification_jobs`
- `audit_logs`
- `refresh_tokens`

## İndeks önerileri

```
users: unique(email)
homes: ownerId
memberships: unique(homeId, userId), userId
pantry_locations: homeId, (homeId, type)
inventory_items: homeId, (homeId, status), (homeId, expiryDate), (homeId, locationId), (homeId, normalizedName)
shopping_items: homeId, listId, status
recipes: normalized ingredients index, category
notification_jobs: userId, scheduledAt, status
audit_logs: homeId, createdAt
```

## Normalizasyon kuralları

- `normalizedName`: küçük harf, Türkçe karakter normalize, trim edilmiş (örn. "Kaşar Peyniri" -> "kasar peyniri").
- `unit`: kontrollü enum — piece, gram, kg, ml, liter, pack, bottle, box.
- `expiryDate`: UTC saklanır; kullanıcı timezone'u sadece gösterimde kullanılır.
- Status değişiklikleri (`consumed`, `discarded`, `expired`, `frozen`) audit log üretir.
- MVP'de hard delete + audit log yeterli; kritik veri için soft delete ileride değerlendirilebilir.

## Şema detayları

### User (`server/src/models/User.ts`) ✅

```
{
  name: string (2-80),
  email: string (unique, lowercase),
  passwordHash: string,
  avatarUrl?: string,
  settings: {
    language: string (default 'tr'),
    theme: 'light' | 'dark' | 'system',
    notificationPreferences: {
      expiryReminders, shoppingUpdates, weeklySummary, dailyReminderEnabled: boolean,
      reminderDaysBefore: number[] (default [7,3,1,0]),
      dailyReminderHour: number 0-23 (default 9)
    }
  },
  createdAt, updatedAt
}
```

`settings` alanı `PATCH /api/users/me/settings` ile aktif olarak okunup
yazılıyor (`server/src/services/userService.ts`) — `theme` artık
`'light'|'dark'|'system'` enum'unun tamamını API üzerinden kabul eder
(Sprint 14.1, dark mode initiative — önceki v1 sınırı kaldırıldı).

### RefreshToken (`server/src/models/RefreshToken.ts`) ✅

```
{
  userId: ObjectId (ref User, indexed),
  tokenHash: string (unique, sha256 — düz token asla saklanmaz),
  expiresAt: Date,
  revokedAt?: Date,
  createdAt, updatedAt
}
```

### PushToken (`server/src/models/PushToken.ts`) ✅

```
{
  userId: ObjectId (ref User, indexed),
  token: string (FCM cihaz token'ı),
  platform: 'ios' | 'android',
  createdAt, updatedAt
}
```

`userId+token` üzerinde unique index — aynı cihaz birden fazla kez
kaydedilirse upsert edilir. `server/src/services/pushService.ts`,
Firebase'in geçersiz/expired olarak işaretlediği token'ları otomatik
temizler. Sprint 16.2 (push initiative) ile eklendi.

Rotation: her `refresh` çağrısında mevcut kayıt `revokedAt` ile işaretlenir, yeni bir kayıt oluşturulur.

### Home (`server/src/models/Home.ts`) ✅

```
{
  name: string (1-80),
  ownerId: ObjectId (ref User, indexed),
  inviteCodeHash: string (unique, sha256 — düz kod yalnızca create/regenerate response'unda döner),
  defaultCurrency: string (default 'TRY'),
  timezone: string (default 'Europe/Istanbul'),
  createdAt, updatedAt
}
```

### Membership (`server/src/models/Membership.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  userId: ObjectId (ref User, indexed),
  role: 'owner' | 'admin' | 'member' | 'viewer',
  status: 'active' | 'invited' | 'removed',
  joinedAt: Date,
  createdAt, updatedAt
}
```

unique index: `(homeId, userId)`. Family ekranının üye listesi
(`GET /api/homes/:homeId/members`) bu koleksiyonu `userId` populate ederek
okur; ayrı bir "davet" kaydı/tablosu yok, `status: 'removed'` soft-delete
olarak kullanılıyor (çıkarma/ayrılma bu alanı günceller, doküman silinmez).

### PantryLocation (`server/src/models/PantryLocation.ts`) ✅ (minimal — Sprint 2'de genişleyecek)

```
{
  homeId: ObjectId (ref Home, indexed),
  name: string,
  type: 'fridge' | 'freezer' | 'pantry' | 'cabinet' | 'medicine' | 'other',
  order: number,
  createdAt, updatedAt
}
```

index: `(homeId, type)`.

### ShoppingList (`server/src/models/ShoppingList.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  name: string,
  isDefault: boolean,
  createdAt, updatedAt
}
```

Ev başına tek `isDefault: true` liste kullanılır (home create sırasında otomatik açılır);
liste CRUD API'si yok, `ShoppingItem` API'si listId'yi client'tan hiç istemez.

### ShoppingItem (`server/src/models/ShoppingItem.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  listId: ObjectId (ref ShoppingList, indexed),
  name: string (max 120),
  normalizedName: string (indexed),
  quantity: number (default 1),
  unit?: 'piece' | 'gram' | 'kg' | 'ml' | 'liter' | 'pack' | 'bottle' | 'box',
  category?: aynı InventoryItem kategori enum'u,
  status: 'pending' | 'checked' (default 'pending', indexed),
  addedBy: ObjectId (ref User),
  sourceItemId?: ObjectId (ref InventoryItem — add-to-shopping aksiyonundan geldiyse),
  checkedAt?: Date,
  createdAt, updatedAt
}
```

index: `(homeId, listId, status)`.

### InventoryItem (`server/src/models/InventoryItem.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  locationId: ObjectId (ref PantryLocation, indexed),
  createdBy: ObjectId (ref User),
  name: string (max 120),
  normalizedName: string (indexed — bkz. normalizeName utility),
  category: 'Dairy' | 'Meat' | 'Vegetable' | 'Fruit' | 'Bakery' | 'Drink' | 'Frozen' |
            'Cleaning' | 'Medicine' | 'Other',
  quantity: number (>= 0),
  unit: 'piece' | 'gram' | 'kg' | 'ml' | 'liter' | 'pack' | 'bottle' | 'box',
  expiryDate?: Date,
  purchaseDate?: Date,
  barcode?: string,
  brand?: string,
  status: 'active' | 'consumed' | 'expired' | 'discarded' | 'frozen' (default 'active'),
  notes?: string (max 500),
  imageUrl?: string,
  reminderDaysBefore: number[] (default [7,3,1,0]),
  doseAmount?: number (bir dozda kullanılan quantity/unit miktarı, ör. 1),
  doseTimes: string[] (default [] — günlük hatırlatma saatleri, "HH:mm", ör. ["09:00","21:00"]),
  createdAt, updatedAt
}
```

indexler: `(homeId, status)`, `(homeId, expiryDate)`, `(homeId, locationId)`, `(homeId, normalizedName)`.
Sabitler `server/src/constants/inventory.ts`'de tutulur (mobile tarafından da referans alınabilir).

`doseAmount`/`doseTimes` yalnızca `category: 'Medicine'` olduğunda anlamlıdır — v1.3
"İlaç modülü" için ayrı bir model yerine mevcut `InventoryItem`'a eklendi (SKT takibi
zaten bu modelden geliyor, bkz. `docs/ProjectDecisions.md`). Stok miktarı hâlâ mevcut
`quantity`/`unit` alanlarıyla tutulur; yeni bir "doz birimi" enum'u eklenmedi.

### AuditLog (`server/src/models/AuditLog.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  itemId: ObjectId (ref InventoryItem),
  userId: ObjectId (ref User),
  action: 'consumed' | 'discarded' | 'frozen' | 'added_to_shopping' | 'dose_taken',
  previousStatus: string,
  newStatus?: string (add-to-shopping'de item status değişmediği için yok),
  metadata?: Mixed (örn. { shoppingItemId } veya { quantityAfter }),
  createdAt (updatedAt yok — timestamps: { createdAt: true, updatedAt: false })
}
```

index: `(homeId, createdAt)`. Her `inventoryActionService` aksiyonu (consume/discard/freeze/
add-to-shopping/take-dose) bir `AuditLog` kaydı üretir; `InventoryItem.status` artık yalnızca bu
servis üzerinden değişebilir (genel PATCH'ten çıkarıldı).

### Recipe (`server/src/models/Recipe.ts`) ✅

```
{
  name: string (unique),
  category?: string (serbest metin, örn. 'Çorba' | 'Ana Yemek' | 'Kahvaltı' | 'Salata' | 'Tatlı'),
  ingredients: [{ name: string, normalizedName: string (indexed), optional: boolean (default false) }],
  instructions: string[],
  imageUrl?: string,
  createdAt, updatedAt
}
```

`homeId` yok — ev bazlı değil, global bir katalog. Seed verisi
`server/src/scripts/recipesSeedData.ts`'de tutulur, `npm run seed:recipes`
(`server/src/scripts/seedRecipes.ts`) ile `name` alanına göre idempotent upsert edilir.

### SavedRecipe (`server/src/models/SavedRecipe.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  recipeId: ObjectId (ref Recipe, indexed),
  createdBy: ObjectId (ref User),
  createdAt, updatedAt
}
```

`{homeId, recipeId}` üzerinde unique compound index — bir ev bir tarifi yalnızca bir
kez kaydedebilir (`Membership`'in `{homeId, userId}` deseniyle aynı yaklaşım).
Kaydetme **ev geneli/paylaşımlı**dır — kullanıcıya özel değil, uygulamadaki diğer tüm
ev-kapsamlı kaynaklarla (envanter, alışveriş listesi, rozetler) tutarlı bir tasarım
kararı (bkz. `docs/ProjectDecisions.md`).

### Asset (`server/src/models/Asset.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  createdBy: ObjectId (ref User),
  name: string (max 120),
  category: 'Electronics' | 'Appliance' | 'Furniture' | 'Other',
  room?: string (serbest metin, ör. "Oturma Odası"),
  brand?: string,
  serialNumber?: string,
  purchaseDate?: Date,
  price?: number (>= 0),
  warrantyEndDate?: Date,
  receiptImageUrl?: string (yalnızca upload endpoint'i ile ayarlanır),
  warrantyDocumentUrl?: string (yalnızca upload endpoint'i ile ayarlanır),
  notes?: string (max 500),
  reminderDaysBefore: number[] (default [30,7,1,0]),
  status: 'active' | 'archived' (default 'active'),
  createdAt, updatedAt
}
```

indexler: `(homeId, status)`, `(homeId, warrantyEndDate)`. v2 "Warranty/documents"
kapsamı — `InventoryItem`'ın aksine ayrı bir model: quantity/unit/pantry-lokasyonu
kavramları bir TV/beyaz eşya için anlamlı değil (bkz. `docs/ProjectDecisions.md`).
`room` basit bir serbest metin alanıdır, `PantryLocation` gibi ayrı bir model/CRUD
değil. `receiptImageUrl`/`warrantyDocumentUrl` genel PATCH ile ayarlanamaz —
yalnızca `POST /:assetId/receipt` ve `POST /:assetId/warranty-document` upload
endpoint'leri bu alanları set eder (bkz. `docs/API.md`).

Kalan şemalar (`NotificationJob`) ilgili modül implementasyonu sırasında buraya
eklenecektir — kod ile bu doküman senkron tutulmalıdır. Bildirimler v1'de tamamen
cihazda zamanlandığı için (`docs/ProjectDecisions.md`) `NotificationJob` şu an planlanmıyor.

### Gamification (model yok)

5 temel rozet (`server/src/constants/badges.ts`) için **kalıcı bir model yok** —
`server/src/services/badgeService.ts`, `InventoryItem`/`AuditLog`/`ShoppingItem`/
`Membership` koleksiyonlarından her istekte canlı sayım yaparak ilerlemeyi hesaplar
(v1 "Temel rozetler" kapsamı; kalıcı "kazanılan rozet" geçmişi/streak sistemi v2.1'e
bırakıldı).
