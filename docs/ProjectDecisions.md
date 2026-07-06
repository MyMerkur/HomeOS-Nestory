# Project Decisions

Mimari kararlar burada kayıt altına alınır (ADR formatı). Yeni bir büyük karar
alındığında yeni bir bölüm eklenir; eskiler değiştirilmez, "superseded" notu düşülür.

---

## Decision: Tek repo (monorepo değil, çoklu repo değil) — server + mobile + docs bir arada

- **Date**: 2026-07-05
- **Status**: Accepted
- **Context**: Proje tek geliştirici tarafından iki cihazda (Mac mini + MacBook) yürütülüyor.
  GitHub Projects/Issues tek merkezden yönetilecek.
- **Decision**: `server/`, `mobile/`, `docs/` aynı repo (`HomeOS-Nestory`) içinde tutulur.
- **Consequences**: Cihazlar arası senkron kolaylaşır; commit mesajlarında modül prefix'i
  (`feat(pantry): ...`) ile hangi tarafın değiştiği netleştirilmelidir.

---

## Decision: React Native CLI (Expo değil)

- **Date**: 2026-07-05
- **Status**: Accepted
- **Context**: Ürün Android ML Kit ve iOS Vision native entegrasyonlarına ihtiyaç duyuyor.
- **Decision**: Expo yerine React Native CLI kullanılır.
- **Consequences**: Native setup Expo'ya göre daha ağır, ancak native modül entegrasyon
  riski daha düşük.

---

## Decision: Backend'de klasik (tip bazlı) MVC klasörleme

- **Date**: 2026-07-05
- **Status**: Accepted
- **Context**: Handbook, modül-bazlı (`modules/<feature>/`) klasörleme öneriyordu. Kullanıcı
  açıkça klasik MVC yapısı istedi: tüm modeller `models/`, tüm controller'lar `controllers/`,
  tüm route'lar `routes/` altında toplanacak.
- **Decision**: `server/src/{models,controllers,services,routes,validations,middlewares}`
  şeklinde tip bazlı klasörleme kullanılır. Service katmanı korunur (ince controller,
  iş kuralı service'te) ama modül bazlı değil, tip bazlı klasörde durur.
- **Consequences**: Yeni bir feature eklerken 4-5 farklı klasöre dosya eklenir (tek bir
  modül klasörüne değil). Dosya adlandırması (`<entity><Type>.ts`) ile ilişkili dosyalar
  birbirine bağlanır. `docs/Architecture.md` bu karara göre güncellendi.

---

## Decision: MongoDB + Mongoose, homeId izolasyonu

- **Date**: 2026-07-05
- **Status**: Accepted
- **Context**: Ev/üyelik/ürün modelleme hızlı ve esnek olmalı.
- **Decision**: Her doküman `homeId` alanı taşır; erişim `requireHomeMembership`
  middleware'i ile zorunlu kılınır.
- **Consequences**: Her yeni sorguda `homeId` filtresi unutulmamalı — bu bir güvenlik
  kontrol noktasıdır, code review'da özellikle bakılmalı.

---

## Decision: Refresh token'ı mobilde AsyncStorage'da sakla (Keychain değil)

- **Date**: 2026-07-06
- **Status**: Accepted
- **Context**: Sprint 1 mobile auth için refresh token'ın cihazda nerede saklanacağına karar
  verilmesi gerekiyordu. react-native-keychain daha güvenli (iOS Keychain/Android Keystore)
  ama ek native paket + `pod install` gerektiriyor.
- **Decision**: MVP hızı için `@react-native-async-storage/async-storage` kullanılır
  (zaten kurulu). Erişim `mobile/src/services/secureStorage.ts` üzerinden soyutlanır.
- **Consequences**: Token düz (şifrelenmemiş) saklanır — rootlu/jailbreak cihazda okunabilir
  risk taşır. `secureStorage.ts` tek dosya olduğu için ileride react-native-keychain'e geçiş
  düşük maliyetli olacak şekilde tasarlandı.

---

## Decision: Tekil kaynak endpointleri iç içe (nested), handbook'un düz önerisinden sapma

- **Date**: 2026-07-06
- **Status**: Accepted
- **Context**: Handbook, tekil ürün endpointlerini düz `/api/items/:itemId` şeklinde öneriyordu.
  Ancak Sprint 1'de yazılan `requireHomeMembership(minRole?)` middleware'i (bkz. Decision
  yukarıda, `server/src/middlewares/requireHomeMembership.ts`) `req.params.homeId` üzerinden
  çalışıyor; düz URL'de homeId bulunmadığı için ayrı bir "önce item'ı çek, sonra homeId'sini
  bul, sonra üyeliği kontrol et" akışı gerekirdi.
- **Decision**: Tekil kaynak endpointleri ilgili home'un altında iç içe kurgulanır:
  `/api/homes/:homeId/items/:itemId` (düz `/api/items/:itemId` değil). Aynı desen ileride
  Shopping/Recipes gibi modüllerde de tekrarlanacak.
- **Consequences**: `requireHomeMembership` hiçbir değişiklik gerekmeden tüm route'larda
  (liste + tekil kaynak) aynı şekilde kullanılabiliyor — tek bir yetkilendirme yolu. Handbook'un
  API tablosuyla birebir örtüşmüyor; `docs/API.md` gerçek (iç içe) şekli yansıtacak şekilde
  güncellendi.

---

## Decision: VPS + Docker Compose + Nginx deploy

- **Date**: 2026-07-05
- **Status**: Accepted
- **Context**: Maliyet kontrolü ve tam kontrol isteniyor.
- **Decision**: Serverless/managed servisler yerine kendi VPS'i üzerinde Docker Compose
  ile MongoDB + API + Nginx çalıştırılır.
- **Consequences**: Backup, SSL yenileme ve log rotation manuel/otomatik script ile
  yönetilmesi gerekir (bkz. docs/Deployment.md).

---

## Decision: SKT hatırlatmaları için yerel bildirim (OneSignal değil)

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: Sprint 4 planlamasında kullanıcı OneSignal'ı önerdi. Ancak SKT
  hatırlatmaları tamamen `InventoryItem.expiryDate` + `reminderDaysBefore`'dan
  önceden hesaplanabiliyor — sunucudan tetiklenen bir push'a ihtiyaç yok.
- **Decision**: `@notifee/react-native` ile tamamen cihazda zamanlanan yerel bildirim
  kullanılır (`mobile/src/services/notificationScheduler.ts`). Aktif ürün listesi
  her değiştiğinde (`useNotificationSync` hook'u) tüm zamanlanmış bildirimler iptal
  edilip yeniden oluşturulur (basit "cancel-all + reschedule" stratejisi).
- **Consequences**: Dış hesap/API key/gizli anahtar yönetimi yok; backend'e cron/job
  runner eklenmedi. İleride family/social bildirimler (örn. "Ahmet ürünü tüketti")
  gerekirse push altyapısı (OneSignal veya benzeri) o zaman ayrıca değerlendirilecek —
  bu karar yalnızca SKT hatırlatmalarını kapsar.
