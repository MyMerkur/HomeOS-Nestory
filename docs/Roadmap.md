# Roadmap

## Sürümler

| Sürüm | Modüller | Amaç |
|---|---|---|
| v1 MVP | Auth, Home, Membership, Pantry locations, Inventory CRUD, Expiration dashboard, Shopping list, Family invite, Local notifications | Çekirdeği çalışır ve yayınlanabilir hale getirmek |
| v1.1 | Recipe matching, saved recipes, ingredient coverage | AI olmadan tarif önerisi |
| v1.2 | Barcode scan, OCR date extraction, quick add | Ürün ekleme sürtünmesini azaltmak |
| v1.3 | Medicine module | İlaç hatırlatma ve SKT takibi |
| v2 | Warranty/documents, receipt scan | Envanteri gıda dışına taşımak |
| v2.1 | Analytics, budget, badges, streaks | Retention ve motivasyon |
| v3 | On-device AI/ML, widgets | Kontrollü akıllı özellikler |

## v1'de kesin olacaklar

- JWT access + refresh token auth
- Home oluşturma (owner rolü)
- Davet koduyla eve katılma
- Pantry lokasyonları (fridge/freezer/pantry/custom)
- Inventory CRUD (ad, kategori, miktar, birim, SKT, lokasyon, durum)
- Dashboard (bugün/3 gün/hafta/toplam)
- Ortak alışveriş listesi
- Local notification (SKT hatırlatma)
- Temel rozetler
- Privacy policy, terms, store hazırlık metinleri

## v1'de olmayacaklar

Ödeme/abonelik, geniş LLM tarif üretimi, tam otomatik fiş okuma, tıbbi tavsiye,
Apple Watch/gelişmiş widget, kapsamlı bütçe, sosyal ağ özellikleri, tam otomatik
dolap fotoğrafı analizi.

## Sprint planı

| Sprint | Hedef | Kartlar |
|---|---|---|
| Sprint 0 | Proje temeli | 0.1 Project Setup, 0.2 CI Pipeline, 0.3 Docker Mongo |
| Sprint 1 | Auth + Home | 1.1 Auth Models, 1.2 Auth API, 1.3 Mobile Auth, 2.1 Home Model, 2.2 Join Home |
| Sprint 2 | Pantry çekirdeği | 3.1 Locations, 3.2 Inventory Model/API, 3.3 Pantry Mobile List, 3.4 Add/Edit Item |
| Sprint 3 | Dashboard + Shopping | 4.1 Expiration Dashboard, 4.2 Expiry Actions, 5.1 Shopping API, 5.2 Shopping Mobile |
| Sprint 4 | Notifications + Recipes | 6.1 Notifications, 7.1 Recipe Seed, 7.2 Recipe Matching |
| Sprint 5 | Gamification + OCR POC + release | 8.1 Gamification v1, 9.1 Barcode POC, 9.2 OCR Date POC, 10.1 Release Polish |
| Sprint 6 | v1.2 Barcode/OCR Production | 11.1 Scanner Hardening, 11.2 Quick Add Flow |
| Sprint 7 | v1.1 Completion | 12.1 Saved Recipes Backend, 12.2 Saved Recipes Mobile |

Kapsam büyümeye başlarsa buradaki v1 sınırlarına geri dönülür.
