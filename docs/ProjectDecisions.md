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

---

## Decision: Dark Mode ekran/bileşen migrasyonu tamamlandı (Sprint 14.2)

- **Date**: 2026-07-08
- **Status**: Accepted
- **Context**: Sprint 14.1'de kurulan tema altyapısını (`ThemeProvider`/
  `useTheme()`, `lightColors`/`darkColors`) gerçek ekranlara bağlamak için
  `ui/` altındaki 10 bileşen ve 18 ekranın tamamındaki statik
  `StyleSheet.create` kullanımının reaktif `createStyles(colors)` desenine
  geçirilmesi gerekiyordu. i18n migrasyonunda (Sprint 13.2) kanıtlanan
  paralel ajan yaklaşımı burada da kullanıldı — desen önce 3 dosyada
  (`Button.tsx`, `Card.tsx`, `DashboardScreen.tsx`) kanıtlandı, sonra 6
  paralel arka plan ajanına (modül bazlı, dosya çakışması olmayan gruplar
  halinde) bölündü.
- **Decision**: Her dosyada modül seviyesindeki `const styles =
  StyleSheet.create({...})`, `function createStyles(colors: ThemeColors)
  { return StyleSheet.create({...}); }` fonksiyonuna dönüştürüldü; bileşen
  içinde `const { colors } = useTheme(); const styles = useMemo(() =>
  createStyles(colors), [colors]);` çağrılıyor. Birden fazla renk-bağımlı
  stil grubu olan dosyalarda (örn. `Button.tsx`'teki `variantStyles` +
  `labelColor`, `RecipesScreen.tsx`'teki kapsam yüzdesi renk haritası)
  `createStyles` bir nesne döndürüp çağrı yerinde destructure ediliyor.
  Ekran içinde tanımlı alt bileşenler (`BadgeCard`, `MedicineRow`,
  `AssetCard`, `ShoppingRow`, `RecipeCard`, `MemberRow` gibi) artık
  `styles`'ı prop olarak alıyor. Test dosyalarının tamamında `render(...)`
  çağrıları en dışta `<ThemeProvider>` ile sarmalandı (mevcut
  `QueryClientProvider` gibi sarmalayıcıların dışında, `DashboardScreen.
  test.tsx`'teki örnek desen izlenerek). `mobile/src/theme/theme.ts`'teki
  `freshnessColor()` artık `useTheme().colors`'ı `FreshnessRing.tsx`
  üzerinden alıyor. `ui/` + 18 ekran dışında kalan tek dosya
  (`modules/assets/components/WarrantyBadge.tsx`, `AssetsScreen`
  içinde kullanılıyor) da tutarlılık için aynı şekilde dönüştürüldü.
  `SettingsScreen.tsx`: "Tema: Açık (v1)" salt-okunur satırı,
  `SegmentedControl` ile Sistem/Açık/Koyu seçiciye dönüştürüldü
  (`useTheme().setMode` + yeni `settingsApi.updateTheme()` →
  `PATCH /users/me/settings { theme }`); 8 dilin tamamına
  `themeSystem`/`themeLight`/`themeDark` anahtarları eklendi,
  kullanılmayan `themeValuePlaceholder` kaldırıldı. `RootNavigator.tsx`:
  `stackHeaderScreenOptions` sabiti `useStackHeaderScreenOptions()`
  hook'una, tab bar renkleri `MainNavigator` içinde `useTheme()`'e
  bağlandı; `NavigationContainer`'a React Navigation'ın
  `DefaultTheme`/`DarkTheme`'i temel alan, uygulamanın kendi renkleriyle
  override edilmiş bir `theme` prop'u geçiriliyor (header/tab arka
  planları dahil tam tutarlılık için).
- **Consequences**: Bu, Sprint 14'ü (Dark Mode initiative) tamamlıyor —
  uygulamadaki tüm ekran/bileşenler artık Ayarlar'dan seçilen Sistem/
  Açık/Koyu temaya reaktif olarak tepki veriyor. Mobile: lint temiz,
  `tsc --noEmit` sıfır hata, 33 suite / 143 test yeşil. Sprint 15
  (Pull-to-Refresh, Skeleton, Toast) sıradaki adım.

---

## Decision: Pull-to-refresh + Skeleton loading eklendi (Sprint 15.1)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: 8 `FlatList` ekranı (`AssetsScreen`, `BadgesScreen`,
  `DashboardScreen`, `MedicinesScreen`, `FamilyScreen`, `PantryScreen`,
  `RecipesScreen`, `ShoppingScreen`) sabit veriyle açılıyordu — kullanıcının
  elle yenilemesi için bir yol yoktu, ilk yükleme de çıplak bir
  `ActivityIndicator` ile gösteriliyordu. Sorgu hook'larının (`useQuery`
  sonucunu doğrudan döndüren `useDashboardQuery` vb.) zaten `refetch`/
  `isRefetching` alanlarını içerdiği görüldü — hook'larda değişiklik
  gerekmedi, sadece ekranlarda bu alanların kullanılması gerekiyordu.
- **Decision**: Yeni `mobile/src/ui/Skeleton.tsx` — `useTheme()`'den
  okuyan, `Animated` ile nabız gibi atan temel dikdörtgen bileşeni
  (`width`/`height`/`radius`/`style` prop'ları). Desen önce
  `DashboardScreen.tsx`'te kanıtlandı, sonra 4 paralel arka plan ajanına
  (PantryScreen; ShoppingScreen; RecipesScreen; Badges+Medicines+Family+
  Assets grubu) bölündü. Her ekranda: (1) `isLoading` sırasında tam ekran
  `ActivityIndicator` yerine ekrana özgü, birkaç `Skeleton` bloğundan
  oluşan yerel bir `<XScreenSkeleton>` bileşeni gösteriliyor; (2) önceden
  `{cond && <EmptyState/>} {cond && <FlatList/>}` şeklindeki koşullu
  dallanma tek bir `FlatList` + `ListEmptyComponent`'e indirgendi, filtre/
  arama gibi liste-üstü içerik `ListHeaderComponent`'e taşındı; (3)
  `FlatList`'e doğrudan `refreshing={isRefetching}` `onRefresh={refetch}`
  prop'ları eklendi (React Native'in `RefreshControl` eleman prop'u değil
  — bu şekilde hem native tarafta otomatik bir `RefreshControl` kurulur
  hem de RTL'de `fireEvent(list, 'refresh')` doğrudan çalışır). `tintColor`
  bilinçli olarak eklenmedi — bu RN sürümünün `FlatList` TS tiplerinde yok
  ve `tsc`'yi kırıyor. `RecipesScreen.tsx`'te `Suggestions`/`Saved` sekme
  değişimine göre aktif sorgudan (`suggestionsQuery`/`savedQuery`) doğru
  `refetch`/`isRefetching` seçiliyor.
- **Consequences**: 8 ekranın tamamında artık aşağı çekince yenileme ve
  ilk yüklemede iskelet önizleme var. Mobile: lint temiz, `tsc --noEmit`
  sıfır hata, 37 suite / 156 test yeşil (8 yeni "refetches when pulled to
  refresh" testi dahil). Sprint 15.2 (Toast/Snackbar + açılış animasyonu)
  sıradaki adım.

---

## Decision: Toast/Snackbar sistemi + markalı açılış yükleme ekranı (Sprint 15.2)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Geçici başarı/bilgi mesajları (şifre değişti, barkod/SKT
  taranamadı) şimdiye kadar `Alert.alert` ile gösteriliyordu — bu, her
  seferinde kullanıcının elle kapatması gereken bir native dialog. Ayrıca
  uygulama açılışı/oturum kontrolü sırasında çıplak bir `ActivityIndicator`
  gösteriliyordu, markaya uygun değildi.
- **Decision**: Yeni `mobile/src/ui/Toast.tsx` (tek bir toast'ın görünümü,
  `Animated` ile alttan kayarak beliren) + `mobile/src/ui/ToastProvider.tsx`
  (`ToastProvider` + `useToast()` → `showToast({message, variant:
  'success'|'error'|'info'})`, 2.5sn sonra otomatik kapanır, üçüncü parti
  kütüphane eklenmedi). Toast arka plan renkleri **kasıtlı olarak** sabit
  koyu tonlar (`useTheme()`'e bağlı değil) — reaktif `darkColors`'taki
  "dark" adlı alanlar (örn. `primaryDark`) karanlık modda anlamı tersine
  dönüyor (tint üzerindeki metin rengi oluyor), bu yüzden her zaman koyu
  chip/beyaz metin görünümü isteyen bir toast için uygun değiller —
  Material Snackbar konvansiyonuyla tutarlı şekilde sabit hex değerleri
  kullanıldı. `App.tsx` kökünde `ToastProvider` eklendi. Mevcut
  `Alert.alert` kullanımları gözden geçirildi: yıkıcı/onay gerektiren
  aksiyonlar (evden ayrıl, üye çıkar, yeni barkod için forma git kararı)
  `Alert.alert` olarak kalıyor; geçici bilgi mesajları (şifre değişti,
  barkod/SKT taranamadı) `useToast()`'a taşındı
  (`SettingsScreen.tsx`, `QuickAddItemScreen.tsx`, `ItemFormScreen.tsx`).
  Yeni `mobile/src/app/screens/LoadingScreen.tsx`: marka adı ("Nestory")
  + fade-in animasyonu + `ActivityIndicator`, hem `App.tsx`'teki i18n
  yükleme kapısında hem `RootNavigator.tsx`'teki oturum bootstrap
  kapısında kullanılıyor (`RootNavigator`'ın kendi yerel `LoadingScreen`
  tanımı kaldırılıp bu paylaşılan bileşene yönlendirildi).
- **Consequences**: Mobile: lint temiz, `tsc --noEmit` sıfır hata, tam
  test suite'i yeşil. `docs/Roadmap.md`'deki Sprint 15 tamamlandı — sırada
  Sprint 16 (Bildirim: Yerel + Push).

---

## Decision: Yerel bildirimlerin profesyonelleştirilmesi (Sprint 16.1)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Yerel bildirimler (`@notifee/react-native`) çalışıyordu ama
  üç eksiği vardı: (1) `useNotificationSync`, uygulama ilk açıldığında
  kullanıcı henüz hiçbir gerçek veri görmeden izin istiyordu; (2) günlük/
  haftalık genel hatırlatma altyapısı yoktu; (3) SKT hatırlatma eşikleri
  (`reminderDaysBefore`) ve günlük hatırlatma saati kullanıcı tarafından
  ayarlanamıyordu, `notificationScheduler.ts`'teki başlık/gövde metinleri
  de i18n'e taşınmamış, hâlâ hardcoded Türkçe idi (Sprint 13 ekran
  migrasyonu bu servis dosyasını kapsamıyordu).
- **Decision**: Backend `User.ts` şemasına
  `notificationPreferences.reminderDaysBefore: number[]` (varsayılan
  `[7,3,1,0]`), `dailyReminderEnabled: boolean` (varsayılan `false`),
  `dailyReminderHour: number` (0-23, varsayılan `9`) eklendi;
  `userValidation.ts`/`userService.ts` aynı alan-bazlı merge deseniyle
  genişletildi. Mobile: `notificationScheduler.ts`'teki tüm başlık/gövde
  metinleri `i18next` (React dışı, doğrudan `i18next.t()`) üzerinden
  `notifications.*` anahtarlarına taşındı (8 dilin tamamında dolduruldu).
  Yeni `scheduleDailyReminder(hour)` / `cancelDailyReminder()` — notifee
  `TimestampTrigger` + `RepeatFrequency.DAILY`, `notifications.
  dailyReminderMessages` havuzundan rastgele bir şablon mesaj seçiliyor
  (spam hissi vermemesi için). Yeni `scheduleWeeklySummary()` /
  `cancelWeeklySummary()` — `RepeatFrequency.WEEKLY`, sabit genel metin
  (gerçek "bu hafta N ürün..." gibi dinamik bir özet, bildirim ateşlenme
  anında canlı veri hesaplayamayacağı için kapsam dışı bırakıldı — bu,
  bilinçli bir sınır, ileride arka plan görevi/push gerektirir). Yeni
  `mobile/src/services/notificationPromptStorage.ts`
  (`hasShownNotificationPrompt`/`markNotificationPromptShown`,
  `AsyncStorage` anahtarı `homeos.notificationPromptShown`) —
  `useNotificationSync.ts` artık izni, envanter sorgusu ilk kez veri
  döndürdüğünde (kullanıcı gerçek veriyi ilk gördüğünde) ve bayrak
  henüz kurulmamışsa istiyor; ayrıca `useProfileQuery()`'den okuduğu
  `dailyReminderEnabled`/`dailyReminderHour`/`weeklySummary` tercihlerine
  göre günlük/haftalık hatırlatmaları otomatik zamanlıyor/iptal ediyor.
  `SettingsScreen.tsx`'in "Bildirimler" kartına: SKT eşikleri için
  `Chip` çoklu-seçim grubu (`0/1/3/7/14/30` gün), günlük hatırlatma
  `Switch`'i, ve etkinken görünen saat seçici (mevcut
  `@react-native-community/datetimepicker`, `mode="time"`, `ItemFormScreen`
  ile aynı desen) eklendi.
- **Consequences**: Yeni ürünlerin varsayılan SKT hatırlatma eşiklerini
  kullanıcının tercihine göre ayarlama (item oluşturma formuna
  `reminderDaysBefore` geçirme) kapsam dışı bırakıldı — şu an yeni
  ürünler hâlâ backend'in genel varsayılanını (`[7,3,1,0]`) alıyor; bu,
  ileride ele alınabilecek bilinen bir sınırdır. Mobile: lint temiz,
  `tsc --noEmit` sıfır hata, 39 suite / 169 test yeşil. Backend: 16 suite
  / 88 test yeşil. Sprint 16.2 (Push altyapısı, FCM) sıradaki adım —
  Firebase projesi/kimlik bilgileri kullanıcıdan istenecek.

---

## Decision: Push bildirim backend altyapısı (Sprint 16.2, backend yarısı)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Push bildirim (FCM) planın en baştan beri bilinen tek
  bağımlılığı vardı: gerçek gönderim için bir Firebase projesi +
  `google-services.json`/`GoogleService-Info.plist` + APNs Auth Key +
  Admin SDK servis hesabı gerekiyor, bunlar kullanıcıdan istenecek
  (`docs/`'da önceden not edilmişti). Ancak backend tarafındaki model/
  servis/endpoint katmanı bu dosyalar olmadan da yazılıp gerçek
  (mock'lanmış) testlerle doğrulanabilir.
- **Decision**: `firebase-admin` (v13) backend'e eklendi. Yeni
  `server/src/models/PushToken.ts` (`userId`, `token`, `platform`,
  `userId+token` üzerinde unique index). Yeni
  `server/src/services/pushService.ts`: `registerPushToken`/
  `removePushToken` (basit upsert/delete) ve `sendToUser(userId,
  {title, body, data})` — kullanıcının tüm token'larına paralel gönderim
  yapar, Firebase'in `messaging/registration-token-not-registered` /
  `messaging/invalid-registration-token` olarak işaretlediği token'ları
  otomatik siler. Firebase Admin SDK, `env.ts`'e eklenen **opsiyonel**
  `FIREBASE_SERVICE_ACCOUNT` (tek satır JSON) env değişkeni sağlanana
  kadar **lazy başlatılmıyor** — `pushService.ts` bu değeri `env`
  singleton'ı yerine bilinçli olarak doğrudan `process.env`'den okuyor
  (testlerde `jest.resetModules()` gerektirmeden runtime'da açılıp
  kapatılabilmesi için; `env.ts`'deki parse-time sabit bir modül
  sıfırlamasında mongoose bağlantısını da koparıyordu). Değer yoksa
  `sendToUser` sessizce no-op olur ve uyarı loglar — geri kalan uygulama
  etkilenmez. Yeni endpoint'ler: `POST /api/users/me/push-tokens`
  (kayıt, upsert) ve `DELETE /api/users/me/push-tokens/:token` (kaldırma,
  idempotent). `userController.ts`/`userRoutes.ts` mevcut desene
  (`validateBody` + `catchAsync`) uyacak şekilde genişletildi.
- **Consequences**: Backend: lint temiz, `tsc --noEmit` sıfır hata,
  18 suite / 99 test yeşil (yeni `pushService.test.ts`,
  `pushRoutes.test.ts` dahil — Firebase Admin SDK `firebase-admin/app`
  ve `firebase-admin/messaging` modülleri `jest.mock` ile taklit edildi).
  Gerçek bir Firebase projesi/kimlik bilgisi olmadığı için gerçek push
  gönderimi henüz doğrulanamadı. Mobile tarafı (native
  `@react-native-firebase/app`+`messaging` kurulumu, token kaydı,
  foreground/background gösterim) kullanıcıdan Firebase kimlik bilgileri
  istendikten sonra ayrı bir adımda ele alınacak — bu dosyalar olmadan
  native paketin iOS tarafını (`pod install`) kurmak `GoogleService-Info.
  plist` eksikliğinden derleme hatasına yol açabileceği için bilinçli
  olarak bekletiliyor.

---

## Decision: Push bildirim mobile entegrasyonu (Sprint 16.2, mobile yarısı)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Kullanıcı Firebase projesi kimlik bilgilerinin tamamını
  (`google-services.json`, `GoogleService-Info.plist`, bir APNs Auth
  Key `.p8` dosyası, ve backend Admin SDK servis hesabı JSON'u) aynı
  oturumda sağladı. Bu, Sprint 16.2'nin backend yarısında bilinçli
  olarak bekletilen mobile entegrasyonun önünü açtı.
- **Decision**: Kimlik bilgisi dosyaları asla repo'ya commit edilmeyecek
  şekilde ele alındı — `google-services.json` → `mobile/android/app/`,
  `GoogleService-Info.plist` → `mobile/ios/NestoryMobile/` (Info.plist
  ile aynı klasör) kopyalandı, ikisi de kök `.gitignore`'a eklendi;
  kullanıcının sağladığı geçici `Firebase İlgili Dosyalar/` klasörü de
  (içindeki `.p8` APNs anahtarı dahil) `.gitignore`'a eklendi. Admin SDK
  servis hesabı JSON'u tek satıra indirilip `server/.env`'deki
  (zaten gitignore'lu) `FIREBASE_SERVICE_ACCOUNT` değişkenine yazıldı —
  gerçek kimlik bilgisiyle `firebase-admin`'in başarıyla initialize
  olduğu doğrulandı. APNs Auth Key repo'ya hiç girmedi — Firebase
  konsoluna (Cloud Messaging → Apple app configuration) doğrudan
  kullanıcı tarafından yüklenmesi gerekiyor, bu adım benim
  tarafımdan yapılamaz.
  `@react-native-firebase/app` + `@react-native-firebase/messaging`
  kuruldu. Android: kök `build.gradle`'a `com.google.gms:google-services`
  classpath'i, `android/app/build.gradle`'a
  `apply plugin: "com.google.gms.google-services"` eklendi (paket adı
  `com.nestorymobile`, `google-services.json`'daki `package_name` ile
  eşleşiyor doğrulandı). iOS: `Podfile`'a `use_modular_headers!` eklendi
  (`FirebaseCoreInternal` → `GoogleUtilities` modül tanımlamadığı için
  Swift pod'ların statik kütüphane olarak entegre edilebilmesi için
  gerekli — CocoaPods'un kendi hata mesajından tespit edildi),
  `pod install --repo-update` ile Firebase 12.15.0 + RNFBApp/RNFBMessaging
  25.1.0 başarıyla kuruldu; `AppDelegate.swift`'e `FirebaseApp.configure()`
  çağrısı eklendi (bundle ID `org.reactjs.native.example.NestoryMobile`,
  `GoogleService-Info.plist`'teki `BUNDLE_ID` ile eşleşiyor doğrulandı).
  Yeni `mobile/src/services/pushNotifications.ts`:
  `registerForPushNotifications()` (izin ister, FCM token alır,
  `POST /users/me/push-tokens` ile kaydeder), `unregisterPushToken()`
  (best-effort, hata yutuyor), `subscribeToForegroundMessages()` —
  gösterim her zaman notifee üzerinden yapılıyor (FCM sadece taşıma
  katmanı), böylece push ve yerel hatırlatmalar tutarlı görünüyor.
  `RootNavigator.tsx`'teki `NotificationSync` bileşenine kayıt+foreground
  abonelik eklendi; `useAuthStore.clearSession()`'a `unregisterPushToken()`
  eklendi (hem manuel çıkışta hem refresh-token geçersizse). Testler için
  yeni `__mocks__/@react-native-firebase/messaging.js` (manuel mock,
  mevcut `@notifee/react-native.js` deseniyle aynı).
- **Consequences**: Native projeler gerçek Firebase kimlik bilgileriyle
  başarıyla yapılandırıldı ve derleniyor (`pod install` ve
  `./gradlew :app:tasks` ikisi de başarılı) — ancak gerçek cihazda uçtan
  uca push gönderimi (Firebase konsolundan test mesajı veya backend
  `sendToUser()` üzerinden) bu ortamda fiilen tetiklenip doğrulanamadı;
  bu, kullanıcının gerçek cihaz/simulator'de manuel doğrulaması gereken
  bir adım olarak kalıyor. Mobile: lint temiz, `tsc --noEmit` sıfır
  hata, tam test suite'i yeşil (yeni `pushNotifications.test.ts` dahil).
  Bu, Sprint 16'yı (Bildirim: Yerel + Push) tamamlıyor.

---

## Decision: Yayın öncesi kalite — a11y, safe area, keyboard, haptics (Sprint 17.1)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Header'sız `AuthStack` (Login/Register) cihaz çentiği/ev
  çubuğuyla çakışma riski taşıyordu; hiçbir form ekranında klavye
  içeriği kapatmıyordu; Ayarlar'daki "Evden ayrıl"/"Çıkış yap"
  butonlarında gönderim sırasında çift-tıklama koruması yoktu; paylaşılan
  `ui/` bileşenlerinden birkaçı (EmptyState, SummaryCard, FreshnessRing)
  ekran okuyucuya ayrı ayrı ikon/metin parçaları olarak görünüyordu;
  hiç dokunsal geri bildirim yoktu.
- **Decision**: `LoginScreen.tsx`/`RegisterScreen.tsx`:
  `useSafeAreaInsets()` ile üst/alt padding + `KeyboardAvoidingView` +
  `ScrollView` (`keyboardShouldPersistTaps="handled"`). Aynı
  `KeyboardAvoidingView` deseni (safe-area'sız, çünkü header'lı stack
  içindeler) `CreateHomeScreen`, `JoinHomeScreen`, `ItemFormScreen`,
  `AssetFormScreen`, `SettingsScreen`'e de uygulandı — bu beş dosya
  paralel bir arka plan ajanıyla hızlandırıldı. `SettingsScreen.tsx`:
  `isLeavingHome`/`isLoggingOut` state'i eklenip mevcut `Button`
  `loading` prop'una bağlandı (diğer 4 ekranda zaten var olan desenle
  aynı). `ui/EmptyState.tsx`/`SummaryCard.tsx`/`FreshnessRing.tsx`:
  ikon+metin (veya sayı+etiket) `accessible accessibilityRole="text"
  accessibilityLabel={...}` ile tek bir gruplanmış öğeye dönüştürüldü
  (ör. FreshnessRing artık "3 gün kaldı" gibi tek bir anlamlı etiket
  okutuyor, SVG halkasını ayrı ayrı okutmuyor). Kod taraması, ikon-only
  interaktif öğelerin (FAB, ShoppingScreen'in sil butonu,
  PantryItemRow'un chevron'u) zaten doğru etiketlenmiş olduğunu
  doğruladı — bu yüzden ek bir tarama/değişiklik gerekmedi.
  `react-native-haptic-feedback` kuruldu (npm + `pod install`,
  Android autolinking `./gradlew :app:tasks` ile doğrulandı — Podfile'da
  Firebase kurulumundan kalan `use_modular_headers!` yeterliydi, ek bir
  Podfile değişikliği gerekmedi). Yeni `mobile/src/services/haptics.ts`
  (`triggerHaptic(type)` ince sarmalayıcı). Kullanım noktaları bilinçli
  olarak sınırlı tutuldu: birincil başarı aksiyonları
  (`ItemFormScreen`/`QuickAddItemScreen`/`AssetFormScreen` kayıt
  başarılı, `SettingsScreen` şifre değişti) ve yıkıcı aksiyon
  onayları (`SettingsScreen` evden ayrıl, `FamilyScreen` üye çıkar) —
  sekme geçişlerine veya genel buton basmalarına eklenmedi.
  `PantryScreen.tsx`'teki tek `Alert.alert` (tüket/at/dondur/listeye
  ekle seçim menüsü) `style: 'destructive'` içermediği için haptics
  kapsamına dahil edilmedi.
- **Consequences**: Mobile: lint temiz, `tsc --noEmit` sıfır hata, tam
  test suite'i yeşil (41 suite / 177 test). Sprint 17.1 tamamlandı —
  Sprint 17.2 (offline/retry, versiyon, gizlilik/şartlar, constants
  gözden geçirme) sıradaki ve son adım.

---

## Decision: Offline algılama, retry, versiyon, gizlilik/şartlar (Sprint 17.2)

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Bağlantı koptuğunda kullanıcıya hiçbir geri bildirim
  yoktu; sorgu hataları sadece statik bir metin gösteriyordu (Sprint
  15.1'de eklenen `refetch` zaten mevcuttu ama hiçbir yerde bir "tekrar
  dene" butonuna bağlanmamıştı); `mobile/package.json`'daki versiyon
  (`0.0.1`) iOS/Android'in gerçek `1.0`/`1.0.0` sürümünden geride
  kalmıştı; Gizlilik Politikası/Kullanım Şartları için gerçek bir URL
  yoktu (kullanıcı onayıyla placeholder ekran kararı zaten en baştan
  alınmıştı).
- **Decision**: `@react-native-community/netinfo` kuruldu (npm +
  `pod install` — Android autolinking `./gradlew :app:tasks` ile
  doğrulandı). Yeni `mobile/src/app/providers/NetworkProvider.tsx`:
  `useIsConnected()` hook'u + `NetInfo.addEventListener` ile takip
  edilen bağlantı durumu; bağlantı koptuğunda `App.tsx` seviyesinde,
  tüm ekranların üstünde sabit (tema-bağımsız, Toast/offline-banner
  konvansiyonuyla tutarlı) koyu kırmızı bir "İnternet bağlantısı yok"
  banner'ı gösteriliyor. 9 ekranın (`Dashboard`, `Badges`, `Medicines`,
  `Assets`, `Family`, `Shopping`, `Recipes`, `Pantry`, `Settings`)
  `isError` dallarına, o ekranın zaten sahip olduğu `refetch()`'i
  çağıran bir "Tekrar dene" (`common.retry`) butonu eklendi — bu
  mekanik değişiklik bir arka plan ajanıyla hızlandırıldı;
  `SettingsScreen.tsx`'in `useProfileQuery()` çağrısına da bu adımda
  `refetch` destructure edildi (önceden yoktu).
  `mobile/package.json` versiyonu `1.0.0`'a yükseltildi (iOS/Android
  ile hizalı). Yeni `mobile/src/config/appInfo.ts`
  (`APP_VERSION = '1.0.0'`, native sürümlerle elle senkron tutulacak,
  yeni bağımlılık eklenmedi). Yeni `PrivacyPolicyScreen.tsx`/
  `TermsScreen.tsx` (basit `ScrollView` + i18n'lenmiş taslak metin, 8
  dilin tamamında dolduruldu — kullanıcıya gösterilen metinde "taslak"
  ibaresi yok, sadece bu ADR'de not düşülüyor). `SettingsScreen.tsx`
  artık `navigation` prop'u alıyor (`DashboardStackScreenProps<
  'Settings'>`), "Uygulama" kartına versiyon satırı +
  Gizlilik Politikası/Kullanım Şartları linkleri eklendi.
  Constants taraması: bu initiative boyunca eklenen sabitler
  (`REMINDER_DAY_OPTIONS`, `TOAST_DURATION_MS`, bildirim kanal ID'leri)
  zaten kendi dosyalarında uygun şekilde kapsamlı — hiçbiri birden
  fazla dosyada tekrar etmiyor, bu yüzden yeni bir `settings/
  constants.ts` veya global `src/constants/` açılmadı (mevcut
  per-modül `constants.ts` konvansiyonu korunuyor, gereksiz soyutlama
  eklenmedi).
- **Consequences**: Mobile: lint temiz, `tsc --noEmit` sıfır hata,
  44 suite / 184 test yeşil. Bu, Sprint 17'yi ve **"Yayın Kalitesi"
  initiative'inin tamamını** (Sprint 13-17) tamamlıyor. Bilinen açık
  kalemler: (1) de/fr/es/it/cs/pt çevirilerinin tamamı LLM tarafından
  üretildi, mağaza yayınından önce anadil kontrolü öneriliyor; (2) push
  bildirim gerçek cihazda uçtan uca doğrulanmadı; (3) APNs Auth Key
  Firebase konsoluna kullanıcı tarafından yüklenmeli; (4) yeni ürünler
  hâlâ backend'in genel SKT hatırlatma varsayılanını alıyor (kullanıcı
  tercihi item oluşturma formuna geçirilmiyor); (5) `RootNavigator.tsx`
  header başlıkları hâlâ hardcoded Türkçe (Sprint 13 ekran
  migrasyonunun kapsamadığı bir dosya).

## Decision: Gerçek cihazda Firebase crash'i ve dev API host'u düzeltildi

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: "Yayın Kalitesi" initiative'i simulator'de tamamlandı
  ama ilk kez gerçek bir iPhone'da denendiğinde uygulama açılışta
  crash oluyordu. Kök neden: `mobile/ios/NestoryMobile/GoogleService-
  Info.plist` diskte vardı ama Xcode projesine (`project.pbxproj`)
  hiç eklenmemişti (dosya build'e kopyalanmıyordu), bu yüzden
  `AppDelegate.swift`'teki `FirebaseApp.configure()` her açılışta
  `NSException` fırlatıp anlık crash'e yol açıyordu (crash raporunda
  `+[FIRApp configure]` doğrulandı). Ayrıca `mobile/src/config/
  env.ts`'deki iOS dev host'u `localhost` idi — bu simulator'de Mac'in
  kendisine işaret eder ama gerçek cihazda cihazın kendi localhost'una
  işaret eder, yani backend'e hiç ulaşılamıyor, login dahil hiçbir
  API isteği çalışmıyordu.
- **Decision**: `xcodeproj` Ruby gem'iyle `GoogleService-Info.plist`
  doğru grup/path (`NestoryMobile/GoogleService-Info.plist`) ile
  projeye eklendi ve Resources build fazına dahil edildi (`pod
  install` + temiz `xcodebuild` ile doğrulandı). `env.ts`'de iOS dev
  host'u sabit bir LAN IP'sine (`DEV_LAN_IP`) çevrildi — hem simulator
  hem gerçek cihaz aynı ağdaki Mac'e bu şekilde ulaşabiliyor.
- **Consequences**: Uygulama artık gerçek cihazda crash olmadan
  açılıyor ve backend'e bağlanabiliyor. `DEV_LAN_IP` Mac'in ağı
  değiştiğinde (farklı Wi-Fi/DHCP) elle güncellenmesi gereken bir
  değer — kalıcı çözüm (Sprint 1'de planlanan `react-native-config`
  ile ortam bazlı konfigürasyon) hâlâ yapılmadı, bu geçici bir dev-only
  düzeltme. Android fiziksel cihaz için henüz aynı sorun
  doğrulanmadı/çözülmedi (yalnızca Android emulator'ün `10.0.2.2`'si
  test edildi).

## Decision: Barkod/SKT tarama akışına gerçek ürün veritabanı entegrasyonu eklendi

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Kullanıcı gerçek cihazda barkod ve SKT taramayı
  denedi; her ikisi de "hata verip elle girmeye yönlendiriyor" olarak
  raporlandı. İncelemede ortaya çıktı ki bu bir crash değildi: kamera/
  ML Kit (`@react-native-ml-kit/barcode-scanning`,
  `@react-native-ml-kit/text-recognition`) barkodu doğru okuyordu,
  ama uygulama barkodu yalnızca **evin kendi envanterinde**
  (`GET /items?barcode=`) arıyordu — dış bir ürün veritabanı
  entegrasyonu hiç yoktu. Bu yüzden daha önce hiç eklenmemiş her ürün
  "Bu barkod yeni" diyaloğuna düşüp kullanıcıyı manuel forma
  yönlendiriyordu — pratikte neredeyse her tarama. Ayrıca
  `QuickAddItemScreen`'de SKT OCR başarısız olduğunda manuel tarih
  girme imkânı yoktu (sadece "Taranmadı" etiketi + tara butonu), ve
  her iki ekranın da tarama handler'larında `catch` bloğu yoktu (native
  bir hata unhandled promise rejection olarak red-box'a düşerdi).
- **Decision**: Backend'e API anahtarı gerektirmeyen, hem global hem
  Türkiye kapsamı olan [Open Food Facts](https://world.openfoodfacts.org)
  proxy'si eklendi: `server/src/services/productLookupService.ts`
  (5s timeout, ağ/parse hatasında `null` döner, asla fırlatmaz) +
  `GET /api/homes/:homeId/items/barcode-lookup/:barcode` (bkz.
  `docs/API.md`). Mobilde: iç envanterde eşleşme yoksa artık bu
  endpoint'e düşülüyor; ürün bulunursa kullanıcı "yeni barkod"
  diyaloğunu hiç görmeden doğrudan ad/kategori önceden doldurulmuş
  `ItemFormScreen`'e yönlendiriliyor (`PantryStackParamList['ItemForm']`
  parametrelerine `initialName`/`initialCategory`/`initialUnit`
  eklendi). `ItemFormScreen`'in kendi tara butonu da aynı fallback'i
  kullanıyor. `QuickAddItemScreen`'e SKT alanı artık dokunulabilir bir
  `Pressable` + `DateTimePicker` (ItemFormScreen'deki desenle birebir)
  — OCR başarısız olursa kullanıcı elle seçebiliyor. Her iki ekranın
  tara handler'larına `catch` eklendi, native hata durumunda kullanıcı
  şimdi genel bir "tarama sırasında sorun oluştu" toast'ı görüyor
  (8 dilde `scanErrorMessage`).
- **Consequences**: Backend: `productLookupService.test.ts` (6 test,
  gerçek ağ çağrısı yapılmadan `global.fetch` mock'lanarak), 19 suite /
  105 test yeşil, lint+tsc temiz. Mobile: `QuickAddItemScreen.test.tsx`
  ve `ItemFormScreen.test.tsx`'e yeni senaryolar eklendi, 44 suite /
  189 test yeşil, lint+tsc temiz. Bilinen kapsam dışı kalan noktalar:
  (1) Open Food Facts esasen **gıda** ürünlerini kapsıyor — temizlik
  malzemesi, ilaç, elektronik gibi gıda-dışı kategorilerde çoğunlukla
  eşleşme bulunamayacak ve kullanıcı yine manuel giriş yapacak (bu,
  Türkiye+global kapsamı olan ücretsiz/anahtarsız en iyi seçenekti;
  ücretli bir barkod API'sine geçiş gelecekte değerlendirilebilir);
  (2) `categories_tags` → dahili kategori haritalaması basit anahtar
  kelime eşleştirmesi (`CATEGORY_TAG_MAP`), kapsamlı bir taksonomi
  eşlemesi değil; (3) OCR'ın kendisi (tarih tanıma doğruluğu, kamera
  netliği/ışık koşulları) bu değişiklikle iyileştirilmedi — sadece
  başarısız olduğunda artık bir manuel giriş yolu var.

## Decision: Barkod kapsamını büyütmek için kendi kullanıcı-kaynaklı barkod kataloğumuz eklendi

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Önceki adımda eklenen Open Food Facts entegrasyonunu
  kullanıcı gerçek cihazda test etti ve barkod+ürün adının hâlâ boş/
  faydasız kaldığını raporladı. Araştırma: Open Food Facts esasen
  **gıda** ürünlerini kapsıyor ve crowdsourced olduğu için Türkiye'deki
  birçok ürün (özellikle gıda-dışı: temizlik, kişisel bakım vb.) hiç
  kayıtlı değil. Alternatif ücretsiz kaynaklar test edildi: Open Food
  Facts'in kardeş projeleri (Open Products Facts, Open Beauty Facts) ve
  UPCitemdb'nin ücretsiz trial API'si — gerçek Türk marka barkodlarıyla
  (Ülker, Bingo) test edildiğinde üçü de sıfır sonuç döndü. Sonuç:
  Türkiye'yi kapsamlı şekilde kapsayan, ücretsiz, hazır bir barkod
  veritabanı yok — bu "free" kısıtı altında değiştirilemeyecek bir
  gerçek.
- **Decision**: Dış kaynaklara bağımlılığı azaltan, uygulamanın
  kendi kullanımıyla büyüyen bir çözüm kuruldu: yeni ev-bağımsız
  `ProductCatalog` koleksiyonu (`server/src/models/ProductCatalog.ts`).
  `productLookupService.lookupProductByBarcode` artık önce bu
  kataloğa bakıyor (anında, dış servise gitmeden); yoksa Open Food
  Facts'e düşüyor ve bulunan sonucu `source: "openfoodfacts"` ile
  kataloğa cache'liyor. Daha da önemlisi: `inventoryService.createItem`
  içine `recordUserProvidedProduct` çağrısı eklendi — bir kullanıcı,
  sistemin bilmediği bir barkod için formu elle doldurup ürün
  oluşturduğunda, o barkod+ad+kategori+birim otomatik olarak
  `source: "user"` ile kataloğa yazılıyor (`$setOnInsert`+`upsert`,
  var olan kaydın üzerine asla yazmıyor). Sonuç: bir ev bir barkodu bir
  kez elle girdiğinde, **tamamen farklı bir ev** aynı barkodu
  taradığında artık otomatik doluyor — kapsam, kullanıcı tabanı
  büyüdükçe organik olarak Türkiye'ye özgü ürünlerle zenginleşiyor.
  Mobilde `ProductLookupResult`'a `unit` alanı eklendi (Open Food
  Facts hiç unit vermiyor, sadece kullanıcı-kaynaklı kayıtlarda dolu)
  ve hem `QuickAddItemScreen`'in `ItemForm`'a yönlendirme
  parametrelerine hem de `ItemFormScreen.applyBarcodeMatch`'e
  işlendi.
- **Consequences**: Backend: `productLookupService.test.ts` artık
  gerçek `mongodb-memory-server` kullanıyor (DB'ye dokunduğu için
  fetch-only mock yeterli değildi), `inventoryService.test.ts`'e 2 yeni
  entegrasyon testi eklendi (barkodlu ürün kataloğa yazılıyor mu,
  barkodsuz ürün kataloğa dokunmuyor mu). 19 suite / 109 test yeşil,
  lint+tsc temiz. Mobile: 44 suite / 189 test yeşil, lint+tsc temiz.
  Bilinen sınırlar: (1) katalog boş başlıyor — ilk birkaç hafta hâlâ
  çoğu Türk ürünü için manuel giriş gerekecek, fayda kullanıcı sayısı
  ve zamanla artacak (soğuk başlangıç problemi, çözümü yok); (2) "ilk
  yazan kazanır" kuralı bir kullanıcının barkodu yanlış/eksik girmesi
  durumunda o hatayı kalıcı hale getirebilir — düzeltme/moderasyon
  akışı bu kapsamda eklenmedi; (3) evler arası veri paylaşımı olduğu
  için teorik olarak bir ev başka bir evin daha önce girdiği ürün
  adını görebilir — kullanıcı-özel bir bilgi değil (sadece barkod→genel
  ürün adı eşlemesi), bu kabul edilebilir görüldü ama KVKK/gizlilik
  açısından ileride gözden geçirilebilir.

## Decision: Yayın sonrası geri bildirim turu — ana sayfa, tarifler, hesap silme, faturalar

- **Date**: 2026-07-09
- **Status**: Accepted
- **Context**: Kullanıcı gerçek cihazda barkod tarama akışını test edip
  memnun kaldıktan sonra tek bir mesajda 8 ayrı iyileştirme/hata talep
  etti: (1) ana sayfanın "boş" görünmesi (sadece "yaklaşan ürün yok"
  yazıyordu, envanter/ilaç/varlık sayıları yoktu); (2) `ItemFormScreen`'de
  SKT tarih seçicinin ekrandan taşması ve cihaz Türkçe olsa bile İngilizce
  ay adları (May, August) göstermesi; (3) Tarifler sayfasının yalnızca
  ilk 10 "öneri"yi (>0% kapsama) gösterip tüm tarif kataloğunu
  gezilebilir kılmaması; (4) App Store/Play Store yayını için zorunlu
  olan hesap silme özelliğinin eksikliği; (5) Rozetlerim/İlaçlarım/
  Varlıklarım/Ailem/Ayarlar kısayollarının ana sayfayı kalabalık
  göstermesi, bunun yerine sol taraftan açılır bir menüde toplanması
  isteği; (6) uygulamanın cihaza "NestoryMobile" olarak kurulması;
  (7) bir "Faturalar" (fatura/tekrarlayan ödeme takibi) modülü eksikliği;
  (8) "aklına başka özellikler de geliyorsa ekle" — açık uçlu delegasyon.
- **Decision**:
  - **Tarih seçici hatası**: `@react-native-community/datetimepicker`
    (v9.1.0) `locale` prop'unu destekliyor ama hiçbir yerde
    kullanılmıyordu — üç `DateTimePicker` çağrısına (`ItemFormScreen`
    SKT+doz saati, `QuickAddItemScreen` SKT) `locale={i18n.language}`
    eklendi. Taşma sorunu: `ItemFormScreen`'de picker, `Pressable` tarih
    butonu ve "SKT Tara" butonuyla aynı `flexDirection:'row'` içine
    sıkıştırılmıştı (iOS `spinner` görünümü geniş bir intrinsic width
    istiyor) — picker, satırın dışına, tam genişlikte ayrı bir satıra
    taşındı (`QuickAddItemScreen`'de zaten bu düzendeydi, oradan
    örneklendi).
  - **Ana sayfa boşluğu**: `dashboardService.getDashboard`'a
    `pantryItemCount` (Medicine hariç aktif ürün), `medicineCount`,
    `assetCount` eklendi (tek round-trip, mevcut `Promise.all`'a
    dahil edildi). `DashboardScreen`'e ikinci bir `SummaryCard` satırı
    eklendi. Bu değişiklik, kısayol chip'lerinin sol menüye taşınmasıyla
    aynı anda yapıldı (aşağıya bkz.) — ana sayfanın üst kısmı artık
    hamburger butonu + 7 istatistik kartından oluşuyor, boş görünmüyor.
  - **Sol menü**: `@react-navigation/drawer` + `react-native-gesture-
    handler`/`reanimated` eklemek yeni native bağımlılık + pod install +
    native rebuild gerektirirdi — bugünkü Firebase/GoogleService-Info.plist
    olayında yaşanan riskin aynısı. Onun yerine yeni `mobile/src/ui/
    SideMenu.tsx`: `Modal` + `Animated.timing` ile soldan kayan bir panel,
    hiçbir yeni native bağımlılık yok. `DashboardScreen`'deki eski
    kısayol `Chip` satırı kaldırıldı, yerine hamburger `IconMenu2`
    butonu (ekran gövdesinde, native header'da **değil** — `navigation.
    setOptions({headerLeft})` mock navigasyonla yazılan unit testlerde
    hiç render edilmediği için test edilemez olurdu, bu yüzden ekran
    gövdesine taşındı) SideMenu'yü açıyor.
  - **Tarifler**: `recipeService.getSuggestions` (yalnızca >0% kapsama,
    en fazla 10, `SUGGESTIONS_LIMIT`) tamamen kaldırıldı, yerine
    `getAllRecipes` (0% dahil tüm tarifler, kapsamaya göre sıralı,
    limitsiz) geçti — iki paralel implementasyon bırakmak yerine tam
    değişim yapıldı (`/recipes/suggestions` route'u silindi, `/recipes`
    eklendi; mobilde `useRecipeSuggestionsQuery` → `useAllRecipesQuery`,
    `RECIPE_SUGGESTIONS_QUERY_KEY` → `ALL_RECIPES_QUERY_KEY` olarak
    yeniden adlandırıldı). `RecipesScreen`'in 3'lü kapsama rengi
    (yüksek/orta/düşük, ikisi aynı turuncu tonu paylaşıyordu) ikili
    yeşil (=100%) / gri (`colors.border`+`colors.textMuted`, <100%)
    rengine indirgendi — kullanıcının tam olarak istediği "yeşil/gri"
    şeması.
  - **Hesap silme**: `userService.deleteAccount(userId, password)` —
    `changePassword` ile aynı şifre-onayı çıtası. Ev sahipliği güvenlik
    kuralı, `membershipService.leaveHome`'un zaten uyguladığı
    `OWNER_CANNOT_LEAVE` mantığının genişletilmiş hali: kullanıcı,
    başka aktif üyeleri olan bir evin tek sahibiyse `400
    HOME_OWNERSHIP_BLOCKS_DELETION` ile reddedilir. Tek başına sahip
    olunan evler tüm verisiyle (Inventory/PantryLocation/ShoppingList/
    ShoppingItem/Asset/SavedRecipe/Membership) cascade silinir;
    paylaşımlı evlerdeki üyelik ise sadece kaldırılır. `AuditLog`
    kasıtlı olarak silinmiyor (geçmiş kayıt tutma). Mobilde
    `SettingsScreen`'e yeni "Tehlikeli Alan" bölümü: şifre alanı +
    `Alert.alert` destructive onayı + hata mesajları (yanlış şifre vs.
    ev sahipliği engeli için farklı metinler, axios error code'una göre
    ayırt ediliyor).
  - **Uygulama adı**: `Info.plist`'teki `CFBundleDisplayName` ve
    Android `strings.xml`'deki `app_name` `"NestoryMobile"` →
    `"Nestory"` (Xcode proje/klasör adı değişmedi, sadece görünen isim).
  - **Faturalar modülü**: Yeni `Bill` modeli + tam CRUD (`billService`/
    `billController`/`billRoutes`, Asset modülünün deseni birebir
    kopyalandı) + `markBillPaid` aksiyonu (tekrarlayan faturada bir
    sonraki ayın kaydını otomatik oluşturur). Mobilde tam yeni bir
    `bills` modülü (Assets modülü şablon alındı): liste, form, durum
    rozeti (`BillStatusBadge` — ödendi/gecikti/X gün kaldı, `WarrantyBadge`
    deseninden esinlenildi). Sol menüye "Faturalarım" eklendi. Kasıtlı
    olarak kapsam dışı bırakılan: fiş fotoğrafı yükleme (Asset'teki
    receipt-upload'a benzer bir şey istenirse ayrı bir iterasyonda
    eklenebilir — bu turda scope'u büyütmemek için atlandı).
  - **"Aklına başka bir şey geliyorsa ekle" için**: Kasıtlı olarak
    yeni, istenmemiş özellik eklenmedi (ör. Open Food Facts görsel
    ürün tanıma, ayrı bir bütçe/analiz modülü) — mevcut talimatlara
    ("gerekenden fazla özellik ekleme") sadık kalındı, yalnızca
    kullanıcının açıkça listelediği 7 madde uygulandı.
- **Consequences**: Backend: `productLookupService`/`recipeService`/
  `dashboardService`/`userService`/`billService` testleri güncellendi/
  eklendi, 20 suite / 123 test yeşil, lint+tsc temiz. Mobile: 46 suite /
  205 test yeşil, lint+tsc temiz. 8 dilin tamamına yeni anahtarlar
  eklendi (344 anahtar/dil, parite doğrulandı). Bilinen açık kalemler:
  (1) Bills modülünde fiş fotoğrafı yükleme yok; (2) `recurring` bill
  rollover'ı yalnızca kullanıcı "ödendi" işaretlediğinde tetikleniyor,
  arka planda otomatik bir cron/job yok (vadesi geçmiş tekrarlayan bir
  fatura, kullanıcı elle işaretlemedikçe bir sonraki ayın kaydını
  oluşturmaz); (3) `SideMenu` gerçek bir `@react-navigation/drawer`
  değil — kaydırma jesti (swipe-to-open) yok, yalnızca buton ile
  açılıyor; (4) uygulama adı değişikliği native rebuild gerektiriyor
  (Info.plist bundle'a derleme zamanında gömülür), cihaza henüz yeni
  build kurulmadı.
