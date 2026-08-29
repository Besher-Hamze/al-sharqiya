# Al-Sharqiya Gypsum & GRC Group

Website, admin dashboard, and REST API for Al-Sharqiya (est. 1986, Al Ain, UAE).

| App | Stack | Port |
|---|---|---|
| `sharqiya_website` | Next.js 16, next-intl, Tailwind v4 | 3000 |
| `sharqiya_dashboard` | Next.js 16, TanStack Query, Zustand | 3001 |
| `sharqiya_backend` | NestJS 11, MongoDB, JWT | 4000 |

Languages: English (`/en`) and Arabic (`/ar`, RTL). Brand gold: `#DAAD49`.

## Local development

Requires Node 22 and MongoDB 7 on `mongodb://127.0.0.1:27017/sharqiya`.

```bash
# 1. Backend
cd sharqiya_backend
cp .env.example .env
# Generate JWT secrets, then:
npm install
npm run seed
npm run start:dev

# 2. Public website
cd sharqiya_website
cp .env.example .env.local
npm install
npm run dev

# 3. Admin dashboard
cd sharqiya_dashboard
cp .env.example .env.local
npm install
npm run dev
```

Quote `ADMIN_PASSWORD` in `.env` — an unquoted `#` starts a comment.

| | |
|---|---|
| Website | http://localhost:3000/en |
| Dashboard | http://localhost:3001 |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |
| Admin login | `admin@alsharqiya.ae` / `Sharqiya#2026` |

## Docker Compose

```bash
cp .env.example .env
# Replace JWT_* secrets in .env
docker compose up --build
docker compose --profile seed run --rm seed
```

| | |
|---|---|
| Website (direct) | http://localhost:3000 |
| Website (NGINX) | http://localhost |
| Dashboard | http://localhost:3001 or http://localhost:8081 |
| API | http://localhost:4000 |

Browser-facing `NEXT_PUBLIC_*` URLs are baked at **image build** time. After changing them, rebuild the website and dashboard images.

Uploads are bind-mounted from `sharqiya_backend/uploads` so the seeded media library stays on disk.

## Layout

```
al-sharqiya/
├── sharqiya_backend/     REST API, uploads, seed
├── sharqiya_website/     Public site (SSR / ISR)
├── sharqiya_dashboard/   Admin CMS
├── nginx/                Reverse proxy
├── docker-compose.yml
└── ARCHITECTURE.md
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for modules, data model, and auth.
