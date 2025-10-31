# GreenVast Backend

GreenVast v0.1 backend powering the low-literacy farmer experience across prices, advisory, communities, marketplace, loans, and analytics. Built with NestJS, Prisma, PostgreSQL, and BullMQ, with Firebase Auth and optional S3-compatible storage.

## Stack

- **Runtime:** Node.js 22 (NestJS 11) + Python FastAPI microservice
- **Database:** PostgreSQL via Prisma ORM
- **Cache/Jobs:** Redis + BullMQ, cron via `@nestjs/schedule`
- **Auth:** Firebase phone auth (ID tokens validated server-side)
- **Messaging:** Socket.IO gateway for listing chat threads
- **Storage:** S3/Supabase-compatible presigned uploads
- **Integrations:** KAMIS commodity prices, OpenWeather One Call, external Python AI (`PYTHON_SVC_URL`)
- **Localization:** JSON bundles (EN/SW) served via `/v1/i18n/:locale`
- **AI:** Python service (`../python-ai`) for price & yield models plus advisory helper

## Getting Started

```bash
cp .env.example .env                     # update connection + API keys
npm install
npm run prisma:generate
npm run prisma:migrate                   # first run: creates schema (interactive)
npm run db:seed                          # optional demo data
npm run start:dev                        # launches at http://localhost:4000/api
```

Set `DATABASE_URL` to a PostgreSQL instance (local Docker recommended) and `REDIS_*` for job queues and caching. A Firebase service account is optional for local work (guard falls back to a dev user when unset).

## Core Modules & Endpoints

- `GET /v1/health` â€“ service heartbeat
- **Users** `/v1/users/*` â€“ profile sync, consent, export/delete
- **Farms** `/v1/farms/*` â€“ parcels, crops, livestock, inventory
- **Prices** `/v1/prices`, `/v1/markets` â€“ weekly medians from KAMIS
- **Advisory** `/v1/advisory?farmId=` â€“ weather-to-action summaries (EN/SW)
- **Communities** `/v1/communities/*` â€“ join/post/report crop+county rooms
- **Marketplace** `/v1/listings`, `/v1/offers`, `/v1/rfq` â€“ listings, offers, RFQs, chat via WS `/chat`
- **Loans** `/v1/loans/*` â€“ loan tracker + repayment ledger + summary
- **Net worth** `/v1/farmer/:id/networth` â€“ consent-aware share link
- **Storage** `/v1/storage/upload-url` â€“ presigned S3 uploads
- **Admin** `/v1/admin/*` â€“ report queue, moderation, analytics snapshot
- **Localization** `/v1/i18n/en|sw` â€“ translation bundles for the app shell
- **Prediction** `/v1/prediction/*` â€“ proxy endpoints for Python AI (price, yield/crop, yield/livestock, train/price)

All authenticated routes require `Authorization: Bearer <FirebaseIDToken>`; admin routes expect the associated user to have role `ADMIN`.

## Background Jobs

- `KamisService` runs daily at **06:00 EAT** (cron) to refresh commodity medians.
- Advisory lookups fetch and cache OpenWeather One Call forecast per farm, storing `WeatherDaily` and `Advisory` rows.
- BullMQ is preconfigured; register additional queues in `MarketplaceModule` or new modules as needed.

## Database Model Highlights

Primary tables include `Users`, `Profiles`, `Farms`, `Parcels`, `CropPlan`, `InventoryLot`, `Listings`, `Offers`, `ChatRoom`, `Communities`, `Posts`, `Loans`, `Repayments`, `PriceSnapshot`, `WeatherDaily`, `Advisory`, `NetWorthRecord`, and consent/audit logs. Inspect `prisma/schema.prisma` for full relations.

## Seeding & Demo

`npm run db:seed` seeds:

- Six staple crops × five counties communities
- Eight major markets with sample KAMIS-style price snapshots (median/min/max/avg)
- Demo farmer (`firebaseUid=demo-farmer`) with parcels, dairy herd, inventory, and yield history rows (crop + milk)

## Testing & Tooling

- `npm run test` / `test:e2e` ready for unit/E2E suites
- Swagger served at `/api/docs` with Firebase bearer security schema
- Socket.IO namespace `/chat` authenticates with Firebase ID tokens (handshake `auth.token`)

## Next Steps

- Wire predictive yield model into `NetworthService` (replace heuristic)
- Connect Supabase or dedicated S3 bucket for media uploads
- Extend BullMQ processors (notifications, analytics fan-out)
- Harden guards with fine-grained roles + auditing
- Expand automated tests around marketplace flows and advisory engine


## AI Microservice

- Python FastAPI lives under `../python-ai` with `/predict/*` and `/train/price` endpoints.
- Configure Nest via `PYTHON_SVC_URL` (defaults to `http://localhost:8000`).
- Run locally:
  ```bash
  cd ../python-ai
  python -m venv .venv && source .venv/bin/activate
  pip install -r requirements.txt
  uvicorn app:app --host 0.0.0.0 --port 8000
  ```
- Tests: `pytest`

Using Docker Compose:
```bash
PYTHON_SVC_URL=http://python-ai:8000 docker-compose up --build
```
Nest hot reload + Python service will expose ports 4000 and 8000 respectively.






