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

## 2. Low-Literacy UX Principles
- One screen = one job: Big buttons, large type, no dense lists.
- Pictograms + words: Icons always paired with text in both languages.
- Simple numbers: Weekly prices in shillings, not confusing deltas.
- Dual language always: English on top, Kiswahili just below.
- Green traffic lights: Use clear signals like ✅ “Good to plant”.
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
