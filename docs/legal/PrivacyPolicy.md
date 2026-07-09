# Gizlilik Politikası

Son güncelleme: 9 Temmuz 2026

Bu gizlilik politikası, Nestory ("uygulama") tarafından toplanan verileri ve bu
verilerin nasıl kullanıldığını açıklar.

## 1. Topladığımız Veriler

Nestory aşağıdaki verileri toplar:

- **Hesap bilgileri**: ad, e-posta adresi, şifre (hash'lenmiş olarak saklanır, düz
  metin asla tutulmaz).
- **Ev/envanter verisi**: oluşturduğunuz evler, davet kodları, pantry lokasyonları,
  eklediğiniz ürünler (ad, kategori, miktar, son kullanma tarihi, barkod vb.),
  alışveriş listesi öğeleri, faturalar, varlıklar (assets) ve ilaç kayıtları.
- **Kullanım geçmişi**: ürün durum değişiklikleri (tüketildi/atıldı/donduruldu)
  denetim amaçlı kaydedilir (`AuditLog`).
- **Cihaz izinleri**: kamera (barkod/SKT tarama özellikleri için, yalnızca
  kullanıldığında), yerel ve push bildirimler (SKT/fatura hatırlatmaları için).
- **Push bildirim token'ı**: bildirim gönderebilmek için cihazınızın push token'ı
  (Firebase Cloud Messaging aracılığıyla) sunucumuzda saklanır.

## 2. Verileri Nasıl Kullanıyoruz

- Hesabınızı doğrulamak ve oturum açık tutmak (JWT access/refresh token).
- Ev üyeleri arasında envanter/alışveriş listesi/fatura paylaşımını sağlamak.
- Son kullanma tarihi ve fatura vadesi yaklaşan öğeler için bildirim göndermek
  (yerel bildirimler cihazda hesaplanır; push bildirimler sunucudan tetiklenir).
- Tarif önerileri sunmak (evdeki ürünlerinizle mevcut tarifleri eşleştirerek —
  yapay zeka/harici bir servis kullanılmaz).

## 3. Veri Paylaşımı

- Verileriniz üçüncü taraflarla **satılmaz veya pazarlama amacıyla paylaşılmaz**.
- Ev verileriniz yalnızca davet kodu ile katıldığınız evin diğer üyeleriyle paylaşılır.
- Barkod/SKT tarama özellikleri cihazınızda (ML Kit ile) çalışır; çekilen fotoğraflar
  sunucuya **gönderilmez**, yalnızca cihazda işlenip atılır.
- Push bildirimler Firebase Cloud Messaging (Google) altyapısı üzerinden gönderilir;
  bu kapsamda cihazınızın push token'ı Google'ın sunucularına iletilir.

## 4. Veri Saklama ve Silme

- Hesabınızı Ayarlar bölümünden kalıcı olarak silebilirsiniz. Hesabınızı sildiğinizde,
  sahibi olduğunuz evlere ait tüm veriler (ürünler, alışveriş listeleri, faturalar,
  varlıklar, tarifler) kalıcı olarak silinir. Başka üyeleri olan bir evin sahibiyseniz,
  hesabınızı silmeden önce ev sahipliğini devretmeniz veya diğer üyeleri çıkarmanız
  istenir.
- Refresh token'lar rotasyon uygular; kullanılmış/süresi geçmiş token'lar geçersiz
  kılınır.

## 5. Veri Güvenliği

Şifreleriniz bcrypt ile hash'lenerek saklanır. Sunucu ile uygulama arasındaki tüm
iletişim HTTPS/TLS ile şifrelenir.

## 6. İletişim

Gizlilikle ilgili sorularınız için: **privacy@nestoryhomekit.com**
