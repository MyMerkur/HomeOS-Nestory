# HomeOS / Nestory

Ev envanteri, son kullanma tarihi takibi, ortak alışveriş listesi ve aile paylaşımını tek mobil uygulamada
toplayan bir home management sistemi.

Mimari, ürün kapsamı ve çalışma disiplini için tek kaynak: [docs/Handbook referansı aşağıda].

## Stack

- **Mobile**: React Native CLI + TypeScript, React Navigation, TanStack Query, Zustand, react-hook-form + zod
- **Backend**: Node.js + Express + TypeScript + MongoDB/Mongoose
- **Auth**: JWT access + refresh token rotation
- **Deploy**: VPS + Docker Compose + Nginx

## Klasör yapısı

```
homeos-nestory/
  server/     -> Express + TypeScript API
  mobile/     -> React Native CLI app
  docs/       -> Mimari, API, veritabanı ve süreç dokümanları
  .github/    -> CI workflow, issue/PR şablonları
```

## Local setup

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### MongoDB (Docker)

```bash
docker compose up -d mongo
```

### Mobile

```bash
cd mobile
npm install
npx react-native run-ios      # veya
npx react-native run-android
```

## Environment variables

Bkz. `.env.example` (root) ve `server/.env.example`.

## Scripts (server)

| Komut | Açıklama |
|---|---|
| `npm run dev` | Dev server (tsx watch) |
| `npm run build` | TypeScript build |
| `npm start` | Prod build çalıştır |
| `npm run lint` | ESLint |
| `npm test` | Jest testleri |

## Dokümantasyon

- [docs/Architecture.md](docs/Architecture.md)
- [docs/API.md](docs/API.md)
- [docs/Database.md](docs/Database.md)
- [docs/Roadmap.md](docs/Roadmap.md)
- [docs/ProjectDecisions.md](docs/ProjectDecisions.md)
- [docs/Security.md](docs/Security.md)
- [docs/Testing.md](docs/Testing.md)
- [docs/Deployment.md](docs/Deployment.md)

## Roadmap (özet)

v1 MVP: Auth, Home, Membership, Pantry locations, Inventory CRUD, Expiration dashboard,
Shopping list, Family invite, Local notifications. Detay için [docs/Roadmap.md](docs/Roadmap.md).
