# Security

- Her endpoint `authenticate` middleware ile korunur; public endpoint'ler istisna olarak
  açıkça işaretlenir.
- Her home kaynağı için `requireHomeMembership` kontrolü zorunludur.
- Rol kontrolü service/controller çağrılmadan önce yapılır.
- Refresh token DB'de hash'lenerek saklanır; düz token asla tutulmaz.
- Auth endpointlerinde rate limiting uygulanır (`express-rate-limit`).
- `helmet`, `cors` ve body limitleri konfigüre edilir.
- Input validation backend tarafında zorunludur (zod).
- Kullanıcı yalnızca üyesi olduğu evlerin verisini görebilir (`homeId` izolasyonu).
- Medicine modülünde tıbbi tavsiye verilmez; sadece hatırlatma ve kayıt tutulur.
- Loglarda password/token/kişisel hassas veri yazılmaz.

## Roller

| Rol | Yetki |
|---|---|
| owner | Evi silme, üyeleri yönetme, tüm modülleri yönetme |
| admin | Ürün/liste/lokasyon yönetimi, üye daveti; owner transfer/silme yok |
| member | Ürün ve alışveriş listesi ekleme/düzenleme; ev ayarlarını sınırlı görme |
| viewer | Sadece görüntüleme; alışveriş işaretleme opsiyonel kapalı |
