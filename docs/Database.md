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

Şema alanları (`User`, `Home`, `Membership`, `PantryLocation`, `InventoryItem`, `ShoppingList`,
`ShoppingItem`, `Recipe`, `NotificationJob`, `AuditLog`) ilgili modül implementasyonu sırasında
buraya eklenecektir — kod ile bu doküman senkron tutulmalıdır.
