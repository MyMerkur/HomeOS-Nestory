# Store Listing (App Store / Google Play)

> Ekran görüntüleri `docs/legal/screenshots/` altında (bkz. ilgili ADR).
> Aşağıdaki metinler doğrudan App Store Connect / Google Play Console
> formlarına kopyalanabilir.

## Uygulama Adı

- **Cihazdaki görünen ad (ikon altı)**: Nestory
- **App Store Connect "Name" alanı**: **Kilerim - Ev Envanteri**
  (yalın "Nestory" adı App Store'da başka bir uygulamayla çakıştığı için
  kullanılamadı — bkz. ilgili ADR. Store'da bu isimle listelenir, ama
  kullanıcının telefonunda ikon altında hâlâ "Nestory" yazar.)
- **Google Play Console "App name" alanı**: Nestory - Ev Envanteri
  (Play Store, App Store'un aksine "Nestory" kelimesini tek başına
  reddetmedi; farklılık App Store'a özgü bir trademark/benzerlik
  taramasından kaynaklanıyordu.)

## Kategori

- App Store: Yaşam Tarzı (Lifestyle) — ikincil: Yiyecek & İçecek (Food & Drink)
- Google Play: Yaşam Tarzı (Lifestyle)

## Alt Başlık (Subtitle — App Store, max 30 karakter)

SKT Takibi, Fatura, Aile Paylaşımı

## Tanıtım Metni (Promotional Text — App Store, max 170 karakter, build gerektirmeden güncellenebilir)

Dolabındaki ürünleri, faturalarını ve ilaçlarını tek yerden takip et. Barkod tara, fiş fotoğrafla toplu ekle, ailenle paylaş — hiçbir şeyi unutma.

## Kısa Açıklama (Play Store — max 80 karakter)

Dolap, fatura ve ilaç takibi; israfı azalt, alışverişi ailenle paylaş.

## Tam Açıklama

Nestory, evindeki ürünleri, faturalarını ve ilaçlarını tek bir yerden takip
etmeni sağlayan bir ev yönetimi uygulamasıdır. Son kullanma tarihi yaklaşan
ürünler için zamanında hatırlatma alır, alışveriş listesini ailenle/ev
arkadaşlarınla paylaşır, faturalarının ödeme takvimini kaçırmazsın.

**Özellikler:**
- 📦 Dolap/buzdolabı/dondurucu bazlı ürün takibi
- ⏰ Son kullanma tarihi yaklaşan ürünler için yerel ve push bildirimler
- 📷 Barkod tarama ile anında ürün ekleme — topluluk kataloğu sayesinde
  zamanla daha çok ürün otomatik tanınır
- 🧾 Fiş fotoğrafı çekip birden fazla ürünü tek seferde ekleme
- 🛒 Ortak alışveriş listesi — ev üyeleriyle gerçek zamanlı paylaşım
- 💊 İlaç takibi — doz hatırlatmaları ve stok uyarıları
- 🧾 Fatura takibi — son ödeme tarihi hatırlatmaları, tekrarlayan faturalar
- 🗄️ Ev eşyası/varlık takibi (garanti, fatura fotoğrafı)
- 🍳 Evindeki ürünlerle eşleşen tarif önerileri
- 🏆 Rozetlerle motivasyon
- 👨‍👩‍👧‍👦 Davet koduyla aile/ev arkadaşı paylaşımı

İsraf etme, unutma — Nestory ile evin kontrolün altında.

## Anahtar Kelimeler (App Store — max 100 karakter, virgülle ayrılmış, boşluksuz)

envanter,kiler,dolap,SKT,son-kullanma,fatura,ilac,alisveris,israf,ev-yonetimi,aile,barkod

## Gerekli İzinler ve Açıklamaları

| İzin | Neden gerekli |
|---|---|
| Kamera | Barkod tarama, SKT tarihi fotoğrafla okuma, fiş fotoğrafından toplu ürün ekleme |
| Fotoğraf Galerisi | Ürün/fatura görsellerini galeriden seçebilme |
| Bildirimler | SKT, fatura ve ilaç hatırlatmaları (yerel + push) |

## Yaş Derecelendirmesi

4+ / Everyone (tıbbi tavsiye içermez — ilaç modülü yalnızca hatırlatma ve
kayıt amaçlıdır; kullanıcı üretimi içerik sınırlıdır, yalnızca ürün adı/not
gibi kısa metinler).

## Destek ve Yasal Bağlantılar

- Destek e-postası: support@nestoryhomekit.com
- Gizlilik Politikası: https://nestoryhomekit.com/privacy.html
- Kullanım Koşulları: https://nestoryhomekit.com/terms.html
- Backend API: https://api.nestoryhomekit.com
- Bundle ID (iOS): `com.nestoryhomekit.app`
- Application ID (Android): `com.nestoryhomekit.app`
