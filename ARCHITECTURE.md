# Al-Sharqiya — System Architecture

Single source of truth for structure and technical decisions.

## 1. Business context

**Client:** Al-Sharqiya Gypsum & GRC Group — est. 1986, Al Ain, UAE.  
Branches in Abu Dhabi, Dubai, Al Ain, and Ajman. Paints division trades as Art Colors.

**Service lines:** Gypsum & GRC, flooring & surface treatment, painting & coatings, line marking & EV parking bays, waterproofing, decorative materials & micro cement.

**Languages:** English (default, `en`) + Arabic (`ar`, full RTL).  
**Brand gold** from the logo: `#DAAD49`.

## 2. Monorepo layout

```
al-sharqiya/
├── sharqiya_backend/      NestJS 11 REST API (port 4000)
├── sharqiya_website/      Next.js public website (port 3000) — en/ar, SSR/ISR, SEO
├── sharqiya_dashboard/    Next.js admin dashboard (port 3001) — CSR + TanStack Query
├── nginx/                 Reverse proxy (Compose)
├── docker-compose.yml
├── .env.example
├── README.md
└── ARCHITECTURE.md
```

Three apps instead of one: the public site must stay fast and SEO-complete (Server Components, ISR). The dashboard is auth-gated and interactive. The backend is the single source of truth.

## 3. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Public site | Next.js 16 (App Router), TS, Tailwind v4 | Server Components + ISR, next-intl for en/ar |
| Dashboard | Next.js 16, TS, Tailwind v4 | TanStack Query + Axios, Zustand for UI/auth |
| UI kit | CVA + owned primitives | No shared package; each app owns its kit |
| Animation | Framer Motion | Scroll reveals, page transitions |
| Forms | React Hook Form + Zod | Dashboard CRUD drawers; public quote/contact |
| API | NestJS 11 + Mongoose 8 + MongoDB | REST `/api/v1`, Swagger at `/api/docs` |
| Auth | JWT access (15m) + refresh rotation (httpOnly cookie), RBAC | Roles: `superadmin`, `admin`, `editor` |
| Uploads | Multer + Sharp | WebP + thumbs, disk `/uploads` |
| Security | Helmet, throttler, class-validator whitelist, CORS allowlist | |
| Deploy | Docker Compose + NGINX | Env via `.env` |

## 4. Internationalization

- Public URLs always prefixed: `/en/...` and `/ar/...` (`localePrefix: always`, default `en`).
- `next-intl` UI strings live in `sharqiya_website/messages/{en,ar}.json`. **Content** is localized in MongoDB as `{ en, ar }` per field.
- Dashboard uses a custom Zustand locale store (`sharqiya-dashboard-locale`) and `messages/{en,ar}.json` — not next-intl.
- `dir="rtl"` on `<html>` for `ar`. Tailwind logical properties (`ps-`, `pe-`, `start-`, `end-`).
- Fonts: **Latin** Sora (display) + Inter (body). **Arabic** IBM Plex Sans Arabic.

## 5. Backend modules

```
src/
├── main.ts                 helmet, cors, versioning, swagger, cookies, /uploads
├── app.module.ts
├── common/                 guards, decorators, interceptors, pagination
└── modules/
    ├── auth/               login, refresh rotation, logout, RBAC
    ├── users/              admin users + roles
    ├── media/              upload (multer+sharp), library CRUD
    ├── services/           service pages (localized, slug, SEO)
    ├── projects/           project case studies
    ├── content/            homepage + about singletons (`GET /content/:key`)
    ├── pages/              legal pages
    ├── gallery/            albums + images
    ├── faqs/
    ├── testimonials/
    ├── quotes/             public quote requests + admin inbox
    ├── contact/            contact form + unread count
    ├── settings/           company, branches, hours, socials, SEO
    ├── navigation/         header / footer / legal menus
    ├── stats/              dashboard overview counts
    └── audit/              admin action trail
```

Conventions:

- List endpoints return `{ data, meta: { total, page, limit } }`.
- Public reads are unauthenticated. Writes need JWT + role.
- Admin lists: `/services/admin`, `/projects/admin`, `/faqs/admin`, `/gallery/admin`, `/testimonials/admin`, `/pages/admin`.
- Content GET returns the **data object directly**. PUT body is `{ data: ... }`.
- Reorder: `PATCH /:resource/reorder` with `{ items: [{ id, order }] }`.
- Localized fields are `{ en, ar }`.

Quote statuses: `new | contacted | quoted | won | lost`.  
Property types: `residential | commercial | industrial | government | other`.

## 6. Data model

Every public entity: `slug`, `order`, `isPublished`, `seo { title, description, ogImage }`, timestamps. Indexes on `slug` + `order`.

Collections: `users`, `refreshtokens`, `media`, `services`, `projects`, `contents`, `pages`, `galleryalbums`, `faqs`, `testimonials`, `quoterequests`, `contactmessages`, `settings`, `navigations`, `auditlogs`.

## 7. Public website

Routes (×2 locales): `/`, `/services`, `/services/[slug]`, `/projects`, `/projects/[slug]`, `/gallery`, `/about`, `/faq`, `/contact`, `/quote`, `/privacy`, `/terms`.

- Server reads via `lib/api.ts` (`fetch` + 60s ISR in production, `no-store` in development).
- Client mutations (quote, contact) via axios to `NEXT_PUBLIC_API_URL/api/v1`.
- `generateMetadata`, OpenGraph, sitemap, robots, `hreflang`.

## 8. Dashboard

No `src/`, no middleware, no `hooks/` folder. Client-side auth: Zustand + `localStorage` (`sharqiya_access_token`, `sharqiya_user`). Refresh token in httpOnly cookie; axios interceptor retries on 401.

| URL | Purpose |
|---|---|
| `/login` | Login |
| `/` | Overview + stats |
| `/quotes` | Quote inbox |
| `/messages` | Contact inbox |
| `/services` | Service CRUD |
| `/projects` | Project CRUD |
| `/content` | Homepage + about |
| `/pages` | Legal pages |
| `/gallery` | Albums + images |
| `/media` | Upload library |
| `/testimonials` | Testimonials |
| `/faq` | FAQ + reorder |
| `/navigation` | Menus |
| `/settings` | Company, branches, hours |
| `/users` | Superadmin-only |
| `/activity` | Audit log |

CRUD pattern: Drawer + RHF + Zod. Singletons use draft state (`lib/use-synced-draft.ts`) instead of `useEffect` + `setState`.

RBAC (enforced on the API):

- **Superadmin:** user create/update/delete, everything else.
- **Admin:** settings, navigation, most deletes.
- **Editor:** publish/reorder/edit content; cannot create services or delete many resources.

## 9. Auth details

- Login payload user shape: `{ id, email, name, role }` (not `userId`). JWT `/auth/me` uses `userId`.
- Refresh cookie path: `/api/v1/auth`. `sameSite=lax`. `secure` follows `COOKIE_SECURE` or `NODE_ENV=production`.
- CORS allowlist includes `http://localhost:3000` and `http://localhost:3001` with credentials.

## 10. Security

Helmet, rate limiting (stricter on auth), class-validator whitelist, bcrypt cost 12, upload MIME + size checks, RBAC guards, audit interceptor. Access token via `Authorization` header; no cookie-authenticated state-changing GETs.

## 11. Deploy

Docker Compose: MongoDB 7, backend, website, dashboard, NGINX (port 80 → website + `/api` + `/uploads`; port 8081 → dashboard). Seed with `docker compose --profile seed run --rm seed`.

`NEXT_PUBLIC_*` values are compiled into the Next.js images. Rebuild after changing public origins.
