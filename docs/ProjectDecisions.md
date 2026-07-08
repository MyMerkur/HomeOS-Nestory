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

---

## Decision: v2 Warranty/Documents — ayrı Asset modeli, gerçek dosya yükleme, tek bildirim döngüsü

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: Roadmap'in v2 maddesi "Warranty/documents, receipt scan — Envanteri
  gıda dışına taşımak". `InventoryItem.locationId` zorunlu ve `PantryLocation.type`
  enum'u (`fridge/freezer/pantry/cabinet/medicine/other`) gıda-depolama
  kelime dağarcığı; `quantity`/`unit` (piece/kg/liter) "bir TV" için anlamlı değil.
  `InventoryItem.imageUrl` bugüne kadar **ölü bir alan**dı — hiçbir upload
  endpoint'i, multer, ya da bulut depolama SDK'sı yoktu, ham bir string olarak
  olduğu gibi saklanıyordu.
- **Decision**: (1) `InventoryItem`'ı genişletmek yerine yeni, ayrı bir `Asset`
  modeli eklendi — bu gerçekten farklı bir alan (quantity/unit/pantry-lokasyonu
  yok). `room` alanı **basit bir serbest metin**tir (ör. "Oturma Odası") —
  `PantryLocation` gibi ayrı bir model/CRUD değil, kapsamı orantısız
  büyütmemek için. (2) Fiş/garanti belgesi fotoğrafları için ilk kez **gerçek
  dosya yükleme altyapısı** kuruldu: multer ile `server/uploads/receipts/`
  altına diskte saklanır, `express.static` ile `/uploads` yolundan sunulur —
  bu, `docs/Deployment.md`'nin backup politikasının zaten öngördüğü ama boş
  bırakılmış "`/uploads` klasörü varsa ayrıca yedeklenir" notunu dolduruyor.
  `receiptImageUrl`/`warrantyDocumentUrl` genel PATCH'ten **ayarlanamaz**,
  yalnızca özel upload endpoint'leri üzerinden set edilir. (3) "Fiş tara"
  özelliği, İlaç modülünün OCR/barkod POC'larında kurulan statik-foto + ML Kit
  pipeline'ını (`captureImage` + `TextRecognition` + `parseExpiryDateFromText`)
  doğrudan yeniden kullanır — tam fiş/kalem ayrıştırma değil, sadece bir satın
  alma tarihi çıkarımı (roadmap'in "v1'de olmayacaklar" listesindeki "tam
  otomatik fiş okuma" yalnızca *tam otomatik* olanı hariç tutuyordu). Oluşturma
  akışında henüz asset id'si olmadığı için fotoğraf `pendingReceiptUri` olarak
  yerel state'te tutulur ve `createAsset` başarılı olduktan hemen sonra
  yüklenir; düzenleme modunda id zaten var olduğu için yükleme anındadır. (4)
  Garanti hatırlatmaları, İlaç modülünde öğrenilen dersle **ayrı bir scheduler
  yerine** `syncItemReminders`'ın mevcut tek iptal-et-yeniden-kur döngüsüne
  eklendi (`asset:${assetId}:${daysBefore}` id öneki ile SKT/doz
  hatırlatmalarından ayrıştırılır) — ikinci bağımsız bir scheduler diğerlerinin
  bildirimlerini silerdi. Varsayılan `reminderDaysBefore` gıdanın `[7,3,1,0]`
  yerine `[30,7,1,0]` — garanti pencereleri gün değil ay/yıl mertebesinde. (5)
  UI, kullanıcının kararıyla Dashboard altına (Badges/Medicines gibi) nested
  bir "Varlıklarım" ekranı olarak eklendi, yeni bir bottom tab değil.
- **Consequences**: Gerçek fotoğraf yükleme/OCR kalitesi ve garanti
  hatırlatmasının gerçek zamanda ateşlenmesi yine Jest ile doğrulanamaz,
  cihaz/simulator'de elle test gerekir. `server/uploads/` diskte tutulur —
  `docs/Deployment.md`'nin backup politikasına artık gerçekten dahil edilmesi
  gerekiyor (VPS'e taşınırken hatırlanmalı).

---

## Decision: Tasarım sistemi — `@tabler/icons-react-native` + statik Baloo2/Inter
font dosyaları + `mobile/src/ui/` bileşen kütüphanesi

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: Uygulama v1→v2 boyunca tamamen fonksiyonel önceliklendirmeyle
  yazıldı — hiçbir ekranda ortak bir tema/bileşen dosyası yoktu, her ekran
  kendi `StyleSheet.create` + ham hex renk değerleriyle (`#1d76db`, `#c0392b`...)
  duplicate stil tanımlıyordu. Alt tab bar'da hiçbir `MainTab.Screen`
  `tabBarIcon` tanımlamadığı için React Navigation'ın "ikon yok" fallback'i
  olan `MissingIcon` (⏷ ters üçgen glifi) görünüyordu — kullanıcının fark
  ettiği bug buydu. Kullanıcı önceki bir oturumda hazırlanmış bir tasarım
  spesifikasyonu ve `theme.ts` token dosyası (yeşil/moss marka rengi, Baloo 2 +
  Inter font sistemi, `FreshnessRing` imza bileşeni, Tabler ikon şartı) verdi.
- **Decision**: (1) `mobile/src/theme/theme.ts` tek kaynak token dosyası olarak
  eklendi (colors/typography/fontSize/spacing/radius/`freshnessColor()`),
  hiçbir top-level klasörde (`services/`, `store/`) index.ts barrel
  bulunmadığından aynı konvansiyonla doğrudan relative import kullanılıyor.
  (2) Baloo2-Bold/SemiBold ve Inter-Regular/Medium fontları
  `@expo-google-fonts/*` npm paketlerinden (sadece statik `.ttf` dosya kaynağı
  olarak, bağımlılık olarak değil — Google Fonts deposu artık yalnızca
  variable font barındırıyor, RN statik ağırlık dosyası istiyor)
  `mobile/assets/fonts/`'a kopyalanıp `react-native-asset` ile iOS/Android'e
  bağlandı; her fontun PostScript adı (`fonttools` ile doğrulandı) `theme.ts`
  değerleriyle birebir eşleşiyor. (3) `react-native-svg` + `@tabler/icons-react-native`
  kuruldu (ikincisi ilkini peer dependency olarak istiyor —
  `FreshnessRing`'in de `react-native-svg` ihtiyacıyla örtüşüyor). Özel bir
  ikon font/glyph sistemi yerine SVG tabanlı bileşen ikonları tercih edildi.
  (4) `RootNavigator.tsx`'teki `MainTab.Navigator`'a 4 sabit `tabBarIcon`
  (`IconHome2`/`IconFridge`/`IconShoppingCart`/`IconChefHat`) ve
  `tabBarActiveTintColor`/`tabBarInactiveTintColor` eklendi — React
  Navigation'ın yerleşik tab bar'ı yeniden temalandı, özel bir `BottomTabBar`
  bileşeni yazılmadı. (5) `mobile/src/ui/` altında `theme.ts`'ye dayanan,
  hiçbir ekranda henüz kullanılmayan (bu ayrı bir sonraki iş kalemi) bir
  bileşen kütüphanesi kuruldu: `Button`, `TextField`, `Card`, `Chip`,
  `SegmentedControl`, `FAB`, `EmptyState`, `SummaryCard`, `PantryItemRow`,
  `FreshnessRing`.
- **Consequences**: Native bağımlılık eklendiğinde (`react-native-svg`)
  Xcode'un DerivedData'sının yeniden build edilmesi gerektiği doğrulandı —
  `pod install` sonrası eski binary ile çalışan simulator kurulumu ikonları
  "tofu" (boş kutu) olarak gösterdi, temiz bir `xcodebuild` + yeniden kurulum
  sorunu çözdü. Mevcut 16 ekranın hiçbiri henüz bu bileşenlere taşınmadı —
  taşıma ayrı bir sprintte (Ekran Geçişi) yapılacak, bu adım sadece altyapı.

---

## Decision: Aile & Ayarlar — yeni bottom tab değil, Dashboard altına nested;
davet kodu tekrar üretilebilir ama asla tekrar görüntülenemez

- **Date**: 2026-07-07
- **Status**: Accepted
- **Context**: Tasarım dokümanı 4 sekmeden birini "Aile" olarak öngörmüştü,
  ama uygulama zaten Tarifler'i 4. sekme yapmıştı ve Aile/Ayarlar kodda hiç
  yoktu. Ayrıca `Home.inviteCodeHash` sadece hash saklıyor — davet kodu
  yalnızca `createHome` response'unda bir kere düz metin olarak dönüyordu,
  sonrasında hiçbir şekilde geri getirilemiyordu (var olan evler için Aile
  ekranının "davet et" özelliği çalışamazdı).
- **Decision**: (1) Aile ve Ayarlar, Varlıklar'da olduğu gibi Dashboard
  tab'ının altına nested ekranlar olarak eklendi — mevcut 4 sekme
  (Özet/Dolap/Alışveriş/Tarifler) korunuyor. (2)
  `POST /:homeId/invite-code/regenerate` eklendi — eski kodu geri getirmek
  yerine yenisini üretip eskisinin hash'inin yerine koyuyor; mobile'da
  "Davet Et" butonu her basışta yeni bir kod üretip native `Share` sheet'i
  açıyor (kopyalama için ayrı bir clipboard kütüphanesi eklenmedi — paylaşım
  sheet'i ve seçilebilir metin yeterli, gereksiz bağımlılık kaçınıldı). (3)
  Owner kendini `removeMember` ile çıkaramaz ve `leaveHome` ile de yalnızca
  evde başka aktif üye yoksa ayrılabilir (`OWNER_CANNOT_LEAVE`) — ownership
  devri özelliği yok, bu yüzden owner'ın evi "yetim" bırakması engelleniyor.
  (4) `User.settings` şeması v1'den beri kodda duruyordu ama hiç
  kullanılmıyordu; `PATCH /users/me/settings` ile ilk kez aktif hale
  getirildi — `theme` alanı v1 sınırı gereği yalnızca `'light'` kabul ediyor.
  (5) Bu iki ekran, henüz hiçbir ekranın kullanmadığı Sprint 10'un
  `mobile/src/ui/` bileşen kütüphanesini (Button/TextField/Card/Chip/
  EmptyState) doğrudan kullanan ilk ekranlar oldu — restyle edilip sonra
  yeniden yazılmak yerine baştan yeni sistemle inşa edildiler.
- **Consequences**: Ekran Geçişi sprintinde (Sprint 12) geri kalan 16 ekran
  bu iki ekranın kurduğu component-kullanım desenini örnek alacak. Gerçek
  cihazda dokunma testi (Simulator'de otomatik tap) bu ortamda Accessibility
  izni olmadığı için yapılamadı — ekran görüntüsü + Jest navigasyon testleriyle
  doğrulandı, tam dokunmatik akış manuel teyit gerektiriyor.

---

## Decision: Ekran Geçişi (18.1) — ItemCard/ExpiryBadge birleştirildi,
navigasyon başlıkları da tema fontuna taşındı

- **Date**: 2026-07-08
- **Status**: Accepted
- **Context**: Sprint 12'nin ilk yarısı — Auth, Onboarding, Dashboard, Pantry
  ekranları `mobile/src/ui/` bileşenlerine taşınıyor. `ItemCard` (Dashboard +
  Pantry'de ortak kullanılan ürün satırı) kendi `ExpiryBadge` bileşenini
  kullanıyordu — bu, tasarım dokümanının imza bileşeni `FreshnessRing`'in
  öncülüydü ve aynı gün-sayısı eşiklerini ham hex ile tekrarlıyordu.
- **Decision**: (1) `ItemCard`, `ui/PantryItemRow` + `ui/FreshnessRing`
  kullanacak şekilde yeniden yazıldı; `ExpiryBadge.tsx` tek kullanıcısını
  kaybettiği için tamamen silindi (yeniden adlandırma/uyumluluk katmanı
  eklenmedi). `PantryItemRow`'a `onLongPress`/`testID` desteği eklendi
  (Pantry'nin uzun-basma aksiyon menüsü için gerekliydi). (2) `ui/Button`,
  `ui/Chip`, `ui/FAB` bileşenlerine `testID` prop'u eklendi — mevcut ekran
  testlerinin `getByTestId` sorgularını bozmadan geçiş yapabilmek için. (3)
  `ui/TextField`'a `hideLabel` prop'u eklendi — arama kutusu gibi görünür
  etiket istemeyen ama yine de `accessibilityLabel` üzerinden erişilebilir
  kalması gereken alanlar için (`label` hâlâ zorunlu, sadece görsel olarak
  gizleniyor). (4) Ekran içi metin/renklerin yanında, `RootNavigator.tsx`'teki
  her `Stack.Navigator`'a ortak bir `stackHeaderScreenOptions`
  (`headerTitleStyle` → Baloo2, `headerTintColor` → primary yeşil) eklendi —
  aksi halde native header başlıkları ("Özet", "Dolap"...) tema dışında
  kalıp sistem fontunda görünmeye devam ederdi (ekran içeriği temalansa
  bile). (5) Test sorgularında `getByPlaceholderText` yerine `getByLabelText`
  kullanılmaya başlandı (TextField artık `accessibilityLabel` varsayılan
  olarak `label`'a eşitliyor) — daha kararlı, placeholder metnine bağımlı
  olmayan sorgular.
- **Consequences**: Bundan sonraki her yeni ekran/bileşen `testID` ve
  `accessibilityLabel` prop'larını en baştan destekleyecek şekilde
  tasarlanmalı. Simulator'de gerçek görünüm (Dashboard ekran görüntüsüyle)
  doğrulandı — chip'ler, tint'li özet kartları, boş durum ikonu ve Baloo2
  başlık fontu birlikte çalışıyor.

---

## Decision: Ekran Geçişi (18.2) — kalan ekranlar tamamlandı, `Button`'a
`warningOutline` varyantı eklendi

- **Date**: 2026-07-08
- **Status**: Accepted
- **Context**: Sprint 12'nin ikinci yarısı — Shopping, Recipes, Dashboard'a
  nested (Badges/Medicines/Assets/AssetForm) ekranlar taşınıyor. Medicine
  modülünün "stokta yok, alışverişe ekle" aksiyonu orijinalde turuncu
  (`#e67e22`, tasarım tokenlarındaki `warning` rengiyle örtüşüyor) bir
  vurgu kullanıyordu — mevcut `Button` bileşeninin `primary/secondary/outline`
  varyantlarının hiçbiri bunu karşılamıyordu.
- **Decision**: (1) `ui/Button`'a dördüncü bir varyant, `warningOutline`,
  eklendi (`colors.warning` kenarlık + `colors.warningDark` metin) — bu,
  gerçek bir tasarım-token karşılığı olan tek kullanımlık bir ihtiyaçtı,
  yeni bir bileşen değil. (2) `ui/SegmentedControl`'e opsiyonel `testID`
  per-option desteği eklendi (Recipes ekranının Öneriler/Kaydedilenler
  sekmeleri için). (3) `WarrantyBadge` (Assets) kendi 5 kademeli aciliyet
  skalasını koruyarak (FreshnessRing'in 3 kademeli eşiğinden farklı, çünkü
  garanti pencereleri ay/yıl mertebesinde) tema token'larına taşındı — ayrı
  bir bileşen olarak kaldı, `FreshnessRing`'e birleştirilmedi (farklı görsel
  dil: metin rozeti vs. halka). (4) Family/Settings ekranları zaten Sprint
  11'de bu bileşen kütüphanesiyle inşa edildiği için bu geçişte değişiklik
  gerekmedi — bu, "yeni ekranları restyle beklemeden baştan yeni sistemle
  yazma" kararının (17.2) doğru sonuç verdiğinin doğrulaması.
- **Consequences**: `mobile/src/ui/` artık uygulamanın **tüm** 18 ekranında
  kullanılıyor — hiçbir ekranda ham hex/StyleSheet-per-screen kalmadı.
  Tasarım sistemi geçişi (Sprint 10-12) tamamlandı.

---

## Decision: Yayın Kalitesi initiative başlıyor — i18n altyapısı (Sprint 13.1)

- **Date**: 2026-07-08
- **Status**: Accepted
- **Context**: Tasarım sistemi geçişi (Sprint 10-12) tamamlandıktan sonra
  kullanıcı App Store/Google Play yayın kalitesine yönelik ayrı, daha büyük
  bir talep getirdi: 8 dilde tam lokalizasyon, sistem temalı dark/light mode,
  pull-to-refresh, skeleton loading, profesyonel bildirim sistemi (yerel +
  push) ve yayın öncesi kalite kalemleri. Kullanıcı onayıyla push bildirim
  altyapısı da kapsama eklendi; Gizlilik Politikası/Kullanım Şartları için
  gerçek URL olmadığından uygulama içi placeholder ekranlar kullanılacak.
  5 sprint / 10 issue'ya bölündü (plan: `docs/` dışında, oturum plan dosyası).
- **Decision**: i18n için `i18next` + `react-i18next` + `react-native-localize`
  seçildi (bare RN uyumlu, Expo gerektirmeyen native modüller — mevcut
  `@notifee/react-native` kurulum desenine benzer `pod install` + otomatik
  linking). 8 dil (`en/tr/de/fr/es/it/cs/pt`) için `mobile/src/i18n/locales/*.json`
  oluşturuldu — İngilizce/Türkçe elle, kalan 6 dil paralel arka plan
  ajanlarıyla çevrildi (yapısal anahtar tutarlılığı script ile doğrulandı:
  8 dosyada da 265 anahtar, tam eşleşme). Cihaz dili `findBestLanguageTag`
  ile algılanır, desteklenmeyen dilde **İngilizce**'ye düşer (Türkçe'ye değil
  — kullanıcının açık talebi). Dil tercihi `mobile/src/services/languageStorage.ts`
  ile `AsyncStorage`'a yazılır (mevcut `secureStorage.ts` deseniyle aynı).
  Sunucu hata mesajları artık client'ta ham Türkçe metin olarak gösterilmiyor
  — `AppError.code` (`error.response.data.error.code`) `errors.<CODE>`
  anahtarına map'lenip `mobile/src/services/apiError.ts` üzerinden
  localize ediliyor. Backend `userValidation.ts`'teki `language` alanı artık
  8 dil enum'una kısıtlı (önceden serbest string idi). Settings ekranına
  8 dili `Chip` listesiyle gösteren bir dil seçici eklendi (tüm ekranların
  string migrasyonu henüz yapılmadı — bu ayrı bir issue, 19.2).
- **Consequences**: Bu adımdan sonra hâlâ 18 ekranın tamamı hardcoded
  Türkçe string kullanıyor (yalnızca Settings'in dil satırı ve altyapı
  değişti) — ekran bazlı tam migrasyon 19.2'de yapılacak. `common.languages.*`
  anahtarları JSON'larda duruyor ama şu an kullanılmıyor (dil adları yerine
  `src/i18n/languages.ts`'teki sabit `LANGUAGE_NATIVE_NAMES` haritası
  kullanılıyor — dil adı bir "çeviri" değil, sabit özel isim olduğu için).
  de/fr/es/it/cs/pt çevirileri LLM tarafından üretildi; mağaza yayınından
  önce anadil konuşan biri tarafından gözden geçirilmesi önerilir.

---

## Decision: Ekranların tam i18n migrasyonu tamamlandı (Sprint 13.2)

- **Date**: 2026-07-08
- **Status**: Accepted
- **Context**: Sprint 13.1'de i18n altyapısı kurulmuştu (i18next, 8 dil, dil
  seçici); bu adımda uygulamadaki 18 ekranın tamamındaki hardcoded Türkçe
  stringler `t()` çağrılarına dönüştürüldü. İş hacmi büyük olduğu için
  (18 ekran + birkaç paylaşılan bileşen) modül bazlı 6 paralel arka plan
  ajanına bölündü — her biri kendi dosya kümesinde çalıştı, dosya çakışması
  olmadı (validasyon şemaları ve `constants.ts` etiket haritaları önceden
  merkezi olarak dönüştürülmüştü, ajanlar sadece ekran/bileşen dosyalarına
  dokundu).
- **Decision**: (1) Zod validasyon şemaları (`authSchema`, `homeSchema`,
  `itemSchema`, `assetSchema`, `settingsSchema`) statik sabitlerden
  `make*Schema(t)` fabrika fonksiyonlarına dönüştürüldü — her ekran artık
  `zodResolver(makeXSchema(t))` çağırıyor. (2) `pantry/constants.ts` ve
  `assets/constants.ts`'teki `CATEGORY_LABELS`/`UNIT_LABELS`/
  `ASSET_CATEGORY_LABELS` haritaları kaldırıldı — görüntü metni artık
  `t('pantry.categories.X')`/`t('pantry.units.X')`/`t('assets.categories.X')`
  üzerinden geliyor (enum dizileri `CATEGORIES`/`UNITS`/`ASSET_CATEGORIES`
  API sözleşmesi olarak aynı dosyada kaldı). (3) Sunucu hata mesajları
  `apiError.ts`'teki `getErrorMessage()` ile `errors.<CODE>` anahtarına
  map'leniyor (Sprint 13.1'de eklenmişti, bu adımda tüm ekranlara yayıldı).
  (4) Tarih formatlama (`toLocaleDateString('tr-TR')`) her yerde
  `toLocaleDateString(i18n.language)`'e çevrildi. (5) Dinamik sunucu verisi
  (tarif adı/malzemeler/talimatlar, rozet adı/açıklaması, kullanıcı/ev/ürün
  adları) kasıtlı olarak **çevrilmedi** — bunlar UI metni değil, kullanıcı
  içeriği. (6) `ui/FreshnessRing.tsx`'teki "gün kaldı" metni de
  `common.daysLeftCaption` anahtarına taşındı (paylaşılan bileşenlerde de
  hiç Türkçe string kalmaması için). (7) Jest test ortamı için
  `jest.config.js`'e `setupFilesAfterEnv: ['<rootDir>/src/i18n/testSetup.ts']`
  eklendi — bu, i18next'i yalnızca `en` kaynağıyla senkron başlatıyor,
  böylece tüm testler İngilizce metin varsayımıyla yazıldı (dil değiştirme
  mantığı ayrı, `languageStorage`/`i18n` birim testlerinde kontrol ediliyor).
- **Consequences**: Uygulamadaki **18 ekranın tamamında** artık hiçbir
  hardcoded UI stringi yok — `grep -rl "[çğıöşüÇĞİÖŞÜ]" src/modules/*/screens
  src/ui` (test dosyaları hariç) sıfır sonuç veriyor. Mobile: lint temiz,
  `tsc --noEmit` sıfır hata, 31 suite / 135 test yeşil. Backend: 16 suite /
  85 test yeşil. Bu, Sprint 13'ü (i18n initiative) tamamlıyor — Sprint 14
  (Dark Mode) sıradaki adım.

---

## Decision: Dark Mode altyapısı kuruldu (Sprint 14.1)

- **Date**: 2026-07-08
- **Status**: Accepted
- **Context**: i18n initiative (Sprint 13) tamamlandıktan sonra "Yayın
  Kalitesi" planının bir sonraki adımı olan Dark Mode'a başlandı.
  `theme.ts` tek statik `colors` paleti taşıyordu; reaktif tema değişimi
  için altyapı yoktu. Backend `User.settings.theme` şeması zaten
  `light|dark|system` enum'unu destekliyordu ama `userValidation.ts`
  yalnızca `z.literal('light')` kabul ediyordu (v1 kısıtı).
- **Decision**: `mobile/src/theme/theme.ts`'teki `colors`, `lightColors`/
  `darkColors` olarak ikiye ayrıldı (`ThemeColors` tipi, aynı anahtar
  setiyle string değerler). Geriye dönük uyumluluk için `colors` adı
  `lightColors`'a eşit statik bir alias olarak korundu — ekran/bileşen
  migrasyonu (Sprint 14.2, ayrı issue) tamamlanana kadar mevcut ~30 dosya
  değişmeden derlenmeye devam ediyor. `freshnessColor()` artık opsiyonel
  bir `themeColors` parametresi kabul ediyor (varsayılan: statik `colors`)
  — 14.2'de `useTheme().colors` ile çağrılacak şekilde güncellenecek.
  Yeni `mobile/src/theme/ThemeContext.tsx`: `ThemeProvider` + `useTheme()`
  — `{ colors, mode, resolvedMode, setMode }`. `mode==='system'` iken
  `Appearance.addChangeListener` ile cihaz temasını izler. Tercih
  `mobile/src/services/themeStorage.ts` ile (mevcut `languageStorage.ts`/
  `secureStorage.ts` deseniyle aynı) `AsyncStorage` anahtarı
  `homeos.theme`'e yazılır, açılışta okunur. `App.tsx` kök seviyede
  `ThemeProvider` ile sarmalandı; `StatusBar barStyle` artık
  `useColorScheme()` yerine `useTheme().resolvedMode`'dan okunuyor.
  Backend `userValidation.ts`'teki `theme` alanı
  `z.enum(['light','dark','system'])` olarak genişletildi (model zaten
  hazırdı, sadece v1 kısıtı kaldırıldı).
- **Consequences**: Bu adımdan sonra hâlâ hiçbir ekran/bileşen
  `useTheme()` tüketmiyor — Ayarlar'daki "Tema: Açık (v1)" satırı da
  değişmedi, tümü Sprint 14.2'de (ui/ altındaki 10 bileşen + 18 ekranın
  `createStyles(colors)` desenine geçişi + Ayarlar'a Sistem/Açık/Koyu
  seçici) ele alınacak. Mobile: lint temiz, `tsc --noEmit` sıfır hata,
  33 suite / 145 test yeşil (yeni `ThemeContext.test.tsx`,
  `themeStorage.test.ts` dahil). Backend: 16 suite / 85 test yeşil.
