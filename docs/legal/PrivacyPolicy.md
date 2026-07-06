# Gizlilik Politikası (Taslak)

> **⚠️ Bu bir taslaktır.** Gerçek yayın öncesi bir hukuk uzmanı/avukat tarafından
> gözden geçirilmeli ve yerel mevzuata (KVKK, GDPR vb.) uygunluğu teyit edilmelidir.
> Bu metin Claude tarafından hazırlanmıştır ve hukuki tavsiye niteliği taşımaz.

Son güncelleme: _(yayın öncesi doldurulacak)_

## 1. Topladığımız Veriler

Nestory ("uygulama"), aşağıdaki verileri toplar:

- **Hesap bilgileri**: ad, e-posta adresi, şifre (hash'lenmiş olarak saklanır, düz
  metin asla tutulmaz).
- **Ev/envanter verisi**: oluşturduğunuz evler, davet kodları, pantry lokasyonları,
  eklediğiniz ürünler (ad, kategori, miktar, son kullanma tarihi, barkod vb.),
  alışveriş listesi öğeleri.
- **Kullanım geçmişi**: ürün durum değişiklikleri (tüketildi/atıldı/donduruldu)
  denetim amaçlı kaydedilir (`AuditLog`).
- **Cihaz izinleri**: kamera (barkod/SKT tarama özellikleri için, yalnızca
  kullanıldığında), yerel bildirimler (SKT hatırlatmaları için).

## 2. Verileri Nasıl Kullanıyoruz

- Hesabınızı doğrulamak ve oturum açık tutmak (JWT access/refresh token).
- Ev üyeleri arasında envanter/alışveriş listesi paylaşımını sağlamak.
- Son kullanma tarihi yaklaşan ürünler için **cihazınızda yerel olarak** bildirim
  zamanlamak (bu bildirimler sunucudan gönderilmez, tamamen cihazınızda hesaplanır).
- Tarif önerileri sunmak (evdeki ürünlerinizle mevcut tarifleri eşleştirerek —
  yapay zeka/harici bir servis kullanılmaz).

## 3. Veri Paylaşımı

- Verileriniz üçüncü taraflarla **satılmaz veya pazarlama amacıyla paylaşılmaz**.
- Ev verileriniz yalnızca davet kodu ile katıldığınız evin diğer üyeleriyle paylaşılır.
- Barkod/SKT tarama özellikleri cihazınızda (ML Kit ile) çalışır; çekilen fotoğraflar
  sunucuya **gönderilmez**, yalnızca cihazda işlenip atılır.

## 4. Veri Saklama ve Silme

- Hesabınızı sildiğinizde ilişkili verileriniz makul bir süre içinde kaldırılır.
- Refresh token'lar rotasyon uygular; kullanılmış/süresi geçmiş token'lar geçersiz
  kılınır.

## 5. İletişim

Sorularınız için: _(yayın öncesi bir destek e-postası eklenecek)_
