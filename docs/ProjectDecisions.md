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

---

## Decision: Barkod/OCR POC'leri için statik foto + ML Kit (canlı kamera değil)

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: Roadmap Sprint 5, kart 9.1/9.2'yi açıkça "POC" olarak adlandırıyor —
  tam özellik v1.2'de. `react-native-vision-camera` + frame-processor + Reanimated/
  worklets ile gerçek zamanlı tarama "production-like" olurdu ama bir POC için
  orantısız kurulum riski/efor taşır.
- **Decision**: `react-native-image-picker`'ın `launchCamera`'ı ile statik foto
  çekilir, `@react-native-ml-kit/barcode-scanning` ve `@react-native-ml-kit/
  text-recognition` bu foto üzerinde çalışır (`mobile/src/services/cameraCapture.ts`
  ortak yardımcısı ikisi tarafından da kullanılır). Gerçek zamanlı kamera önizlemesi/
  frame-processor UX'i yok.
- **Consequences**: `RNMLKitBarcodeScanning` iOS 15.5+ gerektirdiği için
  `mobile/ios/Podfile`'daki `platform :ios` satırı RN 0.86'nın varsayılanı olan
  `min_ios_version_supported` (15.1) yerine sabit `'15.5'` olarak ayarlandı. OCR
  tarih tanıma basit bir regex ile yapılır, %100 güvenilir değildir — bu kabul
  edilen bir POC sınırlamasıdır, kullanıcı SKT'yi elle de girebilir.

---

## Decision: v1.2 için statik-foto mimarisi korunur; sağlamlaştırma + Quick Add ile üretime taşınır

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: v1 roadmap tamamlandıktan sonra sıradaki adım v1.2 ("Barcode scan, OCR
  date extraction, quick add"). Sprint 5'in POC'u canlı kamera + frame-processor'ı
  bilinçli olarak ertelemişti. Bu turda `react-native-vision-camera` + Reanimated
  worklets'e geçmek yerine mevcut statik-foto + ML Kit mimarisi korunmaya karar
  verildi — RN 0.86 + New Architecture ile canlı kamera kurulumu ve Jest'te test
  edilemeyen frame-processor kodu, bu aşama için orantısız risk taşır.
- **Decision**: Bunun yerine iki şey yapıldı: (1) tarayıcı servisleri "found/
  not-found/cancelled" outcome tipine geçirildi (`barcodeScanner.ts`,
  `dateOcrScanner.ts`) — önceden kamera iptali ile "hiçbir şey tanınmadı" aynı
  `null` değerine düşüyordu, bu da OCR uyarısının kullanıcı sadece kamerayı iptal
  ettiğinde bile hatalı şekilde tetiklenmesine yol açıyordu (düzeltildi). OCR tarih
  ayrıştırma artık `.`/`-`/`/` ayraçlarını ve ISO `yyyy-mm-dd` formatını destekliyor,
  birden fazla tarih bulunursa SKT/EXP anahtar kelimesine en yakın olanı, yoksa
  kronolojik olarak en geç tarihi seçiyor (üretim tarihi genelde SKT'den önce basılır).
  (2) roadmap'in daha önce hiç yapılmamış "quick add" maddesi için yeni bir
  `QuickAddItemScreen` eklendi: barkod taranır, aynı barkodla daha önce eklenmiş bir
  ürün varsa (ad/kategori/birim salt-okunur, miktar düzenlenebilir) lokasyon
  **eşleşen ürünün en son eklendiği lokasyona varsayılan olarak ayarlanır** (aynı
  ürün genelde aynı yere konur — ör. süt her zaman buzdolabına), opsiyonel bir SKT
  taraması ile birlikte tek dokunuşla eklenir. Eşleşme yoksa kullanıcıya barkodu
  önceden dolu şekilde tam forma geçme seçeneği sunulur (`initialBarcode` route
  parametresi).
- **Consequences**: Gerçek kamera/ML Kit tanıma kalitesi (fotoğraf netliği, gerçek
  barkod/tarih okunabilirliği) yine Jest ile doğrulanamaz — simulator/cihazda elle
  test gerekir. Canlı kamera UX'i hâlâ ertelenmiş durumda; ileride gerçek zamanlı
  tarama gerekirse bu karar yeniden değerlendirilecek.

---

## Decision: v1.3 İlaç modülü — mevcut InventoryItem'ı genişletme + tek bildirim döngüsü

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: Roadmap'in v1.3 maddesi "Medicine module — İlaç hatırlatma ve SKT
  takibi". `InventoryItem.category` zaten `'Medicine'` değerine sahipti ama hiçbir
  özel davranışı yoktu. SKT takibi zaten `InventoryItem`'dan geliyor; ayrıca
  `mobile/src/services/notificationScheduler.ts`'in `syncItemReminders`'ı **tüm**
  zamanlanmış bildirimleri iptal edip yeniden kuruyor (`getTriggerNotificationIds()`
  uygulamanın sahip olduğu her id'yi döner, kanal/önek filtresi yok) — bağımsız
  ikinci bir "doz hatırlatma" scheduler'ı bu döngüyle çakışıp birbirinin
  bildirimlerini silerdi.
- **Decision**: (1) Yeni bir model yerine `InventoryItem`'a opsiyonel `doseAmount`/
  `doseTimes` alanları eklendi — stok hâlâ mevcut `quantity`/`unit` ile tutuluyor,
  yeni bir "doz birimi" enum'u yok. (2) `consumeItem`/`discardItem`/`freezeItem`'ın
  aksine yeni `takeDose` aksiyonu `status`'u **değiştirmez**, yalnızca `quantity`'yi
  `doseAmount` kadar azaltır (0'da durur) — ilaç tükenmeyip yenilenebildiği için
  tek seferlik bir durum geçişi yerine tekrarlanabilir bir aksiyon olarak modellendi.
  (3) Doz hatırlatmaları **ayrı bir scheduler yerine** `syncItemReminders`'ın
  mevcut tek iptal-et-yeniden-kur döngüsüne eklendi; ayrı bir id önekiyle
  (`dose:${itemId}:${time}`) SKT hatırlatmalarından ayrıştırılır, Notifee'nin
  `repeatFrequency: DAILY` özelliğiyle günlük tekrar native olarak yönetilir (uygulama
  her gün yeniden zamanlamaz). (4) UI, Pantry listesini genişletmek yerine Dashboard
  altına (Badges ile aynı yerleşim) ayrı bir "İlaçlarım" ekranı olarak eklendi —
  asıl kullanım senaryosu ("bugün hangi ilaçları almalıyım") Pantry'nin lokasyon
  bazlı gezinme modeline uymuyor. Ürün ekleme/düzenleme yine mevcut
  `ItemFormScreen` üzerinden yapılır (doz alanları yalnızca `category === 'Medicine'`
  seçiliyken görünür) — CRUD tekrarlanmadı.
- **Consequences**: Stok `0`'a düştüğünde otomatik `consumed` durumuna geçiş **yok**
  — kullanıcı "Alışverişe ekle" kısayoluyla (mevcut `addToShopping` aksiyonu)
  manuel olarak yeniden stoklar. Günlük tekrarlayan bildirimin gerçek zamanda
  ateşlenmesi Jest ile doğrulanamaz, cihaz/simulator'de elle test gerekir. Uygulama
  yine tıbbi tavsiye vermez — `docs/legal/TermsOfService.md`'de belirtildiği gibi
  yalnızca hatırlatma/kayıt amaçlıdır.
