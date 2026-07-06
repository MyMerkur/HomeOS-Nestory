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

## Decision: VPS + Docker Compose + Nginx deploy

- **Date**: 2026-07-05
- **Status**: Accepted
- **Context**: Maliyet kontrolü ve tam kontrol isteniyor.
- **Decision**: Serverless/managed servisler yerine kendi VPS'i üzerinde Docker Compose
  ile MongoDB + API + Nginx çalıştırılır.
- **Consequences**: Backup, SSL yenileme ve log rotation manuel/otomatik script ile
  yönetilmesi gerekir (bkz. docs/Deployment.md).
