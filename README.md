# GreenVast

A mobile-first platform for smallholder farmers, investors, and buyers in Kenya. GreenVast is designed for low-literacy users, with a simple, green-themed interface, dual-language support (English + Kiswahili), and clear, actionable features for agriculture and market access.

---

## Table of Contents
1. Overview
2. Low-Literacy UX Principles
3. Features
   - Farmer
   - Investor
   - Buyer
4. Technologies Used
   - Frontend
   - Backend
   - Python AI
5. Project Structure
6. Setup & Installation
   - Frontend
   - Backend
   - Python AI
7. API & Modules
8. Example App Copy
9. Micro-Flows
10. License

---

## 1. Overview
GreenVast empowers farmers, investors, and buyers to connect, trade, and manage agricultural activities with clarity and simplicity. The platform supports role-based access, community joining, market uploads, loan tracking, and more.

---

##  Watch Our Pitch
[![Pitch Deck](https://img.shields.io/badge/View%20Pitch%20Deck-Beautiful.ai-brightgreen?style=for-the-badge)](https://www.beautiful.ai/player/-Ocu_f2ruFbkFy_DfD3r)



## 2. Low-Literacy UX Principles
- One screen = one job: Big buttons, large type, no dense lists.
- Pictograms + words: Icons always paired with text in both languages.
- Simple numbers: Weekly prices in shillings, not confusing deltas.
- Dual language always: English on top, Kiswahili just below.
- Green traffic lights: Use clear signals like  “Good to plant”.
- Three choices max: Never show more than three main actions per screen.

---

## 3. Features

### Farmer
- Dashboard: Weather, outbreak alerts, quick actions (Market, Community, Profile)
- Market: Upload and view produce, see prices
- Loan Tracker: Track loans and repayments
- Net Worth: View farm value (if consented)
- Community: Join WhatsApp groups, see joined communities

### Investor
- Dashboard: View open farmers, track farm value, offer funding/loans
- Profile: Investment history, logout

### Buyer
- Dashboard: View products, profile

---

## 4. Technologies Used

### Frontend
- React Native (Expo)
- TypeScript
- Zustand (state management)
- React Navigation
- i18next (internationalization)
- @expo/vector-icons
- WhatsApp deep linking

### Backend
- Node.js (NestJS)
- Prisma ORM (PostgreSQL)
- Redis + BullMQ (jobs, cache)
- Firebase Auth (phone-based)
- Socket.IO (chat)
- S3/Supabase-compatible storage
- KAMIS price feed, OpenWeather integration
- RESTful API endpoints for all modules

### Python AI
- Python 3.10+ (FastAPI)
- Trained modules:
  - price_model.py (commodity price prediction)
  - yield_model.py (crop/livestock yield prediction)
  - advisory.py (weather-driven advisory)
  - kamis_ingest.py (data ingestion)
- REST endpoints: `/predict/*`, `/train/price`
- Docker-ready, can run standalone or via backend proxy

  **Team:**
- Rene Bosire – Data Scientist
- Rita Mnavu – Fullstack Developer
- Aisha Omar – Fullstack Developer
- Salma Adam – Project Manager

---

## 5. Project Structure

```
greenvast/
  README.md
  frontend/
    App.tsx
    src/
      Farmer/
      investor/
      buyer/
      authentication/
      store/
  Backend/
    src/
      admin/
      advisory/
      auth/
      communities/
      farms/
      i18n/
      loans/
      marketplace/
      markets/
      networth/
      prediction/
      prisma/
      storage/
      users/
    prisma/
      schema.prisma
      seed.ts
    test/
      app.e2e-spec.ts
  python-ai/
    app.py
    services/
      advisory.py
      kamis_ingest.py
      price_model.py
      yield_model.py
    tests/
      test_health.py
      test_price.py
      test_yield.py
```

---

## 6. Setup & Installation

### Frontend
```bash
cd greenvast/frontend
npm install
npx expo start
```

### Backend
```bash
cd greenvast/Backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run start:dev
```

### Python AI
```bash
cd greenvast/python-ai
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```
Or use Docker Compose:
```bash
PYTHON_SVC_URL=http://python-ai:8000 docker-compose up --build
```

---

## 7. API & Modules

### Backend REST Endpoints
- `/v1/health` – service heartbeat
- `/v1/users/*` – profile sync, consent, export/delete
- `/v1/farms/*` – parcels, crops, livestock, inventory
- `/v1/prices`, `/v1/markets` – weekly medians from KAMIS
- `/v1/advisory?farmId=` – weather-to-action summaries (EN/SW)
- `/v1/communities/*` – join/post/report crop+county rooms
- `/v1/listings`, `/v1/offers`, `/v1/rfq` – marketplace
- `/v1/loans/*` – loan tracker + repayment ledger
- `/v1/farmer/:id/networth` – consent-aware share link
- `/v1/storage/upload-url` – presigned S3 uploads
- `/v1/admin/*` – moderation, analytics
- `/v1/i18n/en|sw` – translation bundles
- `/v1/prediction/*` – proxy endpoints for Python AI

### Python AI Endpoints
- `/predict/price` – price prediction
- `/predict/yield` – yield prediction
- `/predict/advisory` – weather-driven advisory
- `/train/price` – train price model

---

## 8. Example App Copy

**Prices card (farmer view)**
- Title: “Tomatoes — price of the week”
- Value: “KSh 78/kg”
- Subtext: “Soko: Eldoret • Updated: Wed”
- Kiswahili: “Bei ya wiki: KSh 78/kg”

**Weather advisory card**
- Header: “Planting” / “Weeding” / “Harvesting”
- Message: “Good to plant next 3 days. Light rain is coming.”
- Kiswahili: “Ni vizuri kupanda siku 3 zijazo. Mvua nyepesi inakuja.”

**Community picker**
- “Choose your groups” / “Chagua vikundi vyako”
- Chips: “Maize • Kericho”, “Dairy • Nyeri”, “Tomatoes • Kirinyaga”

**Loan tracker**
- “Total loan: KSh 25,000 • Paid: KSh 7,000 • Balance: KSh 18,000”
- Kiswahili: “Mkopo jumla: KSh 25,000 • Uliolipwa: KSh 7,000 • Salio: KSh 18,000”

**Net-worth (for investors, only if farmer consents)**
- “Farm value (estimate): KSh 184,000”
- “Land + crops + stock − loans” / “Ardhi + mazao + stoo − mikopo”

---

## 9. Micro-Flows
- Onboarding (≤60s): Phone → Name → County/Sub-County → Pick crops/livestock using icons → Join suggested communities → Done.
- Posting produce: Tap “Sell” → Pick crop icon → Quantity + photo + ask price → “Post”.
- Joining communities: Show 6 suggested chips; “See more” opens a grid.
- Weather advisory: A single card with today’s action; swipe for next day.
- Loans: One screen with three big fields (Amount, Lender, Start date) and one “Add payment” button.

---

## 10. License


---

GreenVast is built for clarity, speed, and accessibility—empowering farmers and their partners to thrive.
