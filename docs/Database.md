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
    notificationPreferences: { expiryReminders, shoppingUpdates, weeklySummary: boolean }
  },
  createdAt, updatedAt
}
```

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

Rotation: her `refresh` çağrısında mevcut kayıt `revokedAt` ile işaretlenir, yeni bir kayıt oluşturulur.

### Home (`server/src/models/Home.ts`) ✅

```
{
  name: string (1-80),
  ownerId: ObjectId (ref User, indexed),
  inviteCodeHash: string (unique, sha256 — düz kod yalnızca create response'unda döner),
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

unique index: `(homeId, userId)`.

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
  createdAt, updatedAt
}
```

indexler: `(homeId, status)`, `(homeId, expiryDate)`, `(homeId, locationId)`, `(homeId, normalizedName)`.
Sabitler `server/src/constants/inventory.ts`'de tutulur (mobile tarafından da referans alınabilir).

### AuditLog (`server/src/models/AuditLog.ts`) ✅

```
{
  homeId: ObjectId (ref Home, indexed),
  itemId: ObjectId (ref InventoryItem),
  userId: ObjectId (ref User),
  action: 'consumed' | 'discarded' | 'frozen' | 'added_to_shopping',
  previousStatus: string,
  newStatus?: string (add-to-shopping'de item status değişmediği için yok),
  metadata?: Mixed (örn. { shoppingItemId }),
  createdAt (updatedAt yok — timestamps: { createdAt: true, updatedAt: false })
}
```

index: `(homeId, createdAt)`. Her `inventoryActionService` aksiyonu (consume/discard/freeze/
add-to-shopping) bir `AuditLog` kaydı üretir; `InventoryItem.status` artık yalnızca bu
servis üzerinden değişebilir (genel PATCH'ten çıkarıldı).

Kalan şemalar (`Recipe`, `NotificationJob`) ilgili modül implementasyonu sırasında buraya
eklenecektir — kod ile bu doküman senkron tutulmalıdır.
