# Security

- Her endpoint `authenticate` middleware ile korunur (`server/src/middlewares/authenticate.ts`
  ✅); public endpoint'ler istisna olarak açıkça işaretlenir.
- Her home kaynağı için `requireHomeMembership(minRole?)` kontrolü zorunludur
  (`server/src/middlewares/requireHomeMembership.ts` ✅). `:homeId` param'ı önce
  `validateParams(homeIdParamSchema)` ile ObjectId formatına doğrulanır, sonra üyelik
  kontrol edilir (`status === 'active'` + varsa minimum rol: viewer < member < admin < owner).
  Üye değilse veya `removed` ise `403 NOT_A_MEMBER`; rol yetersizse `403 INSUFFICIENT_ROLE`.
  Route sırası: `authenticate -> validateParams -> requireHomeMembership(role?) -> validateBody -> controller`.
  Henüz hiçbir `:homeId` route'u yok (Sprint 2'de Inventory ile birlikte uygulanacak) —
  middleware ve testleri (member/non-member/removed/insufficient-role) hazır.
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
