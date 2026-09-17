# Customer Enquiry Management System

Production-ready customer enquiry portal and admin panel.

Public customers submit enquiries (typically after scanning a QR code). Staff manage customers, enquiries, follow-ups, reports, WhatsApp acknowledgements, and users.

## Architecture

- **Frontend:** React + Vite (customer portal + admin panel)
- **Backend:** Node.js + Express REST API (`/api/v1`)
- **Database:** MySQL via Sequelize ORM (migrations + seeders)
- **Auth:** JWT + bcrypt + role-based access (`SUPER_ADMIN`, `ADMIN`, `STAFF`)
- **WhatsApp:** Pluggable integration (`mock` by default, HTTP provider when credentials are set)
- **PDF:** Enquiry acknowledgement generated with PDFKit

See `docs/` for architecture, database, API, and setup details.

## Requirements

- Node.js 18+
- MySQL 8+
- npm

## Installation

```bash
cd backend
copy .env.example .env
npm install

cd ../frontend
copy .env.example .env
npm install
```

On macOS/Linux use `cp .env.example .env`.

## MySQL setup

```sql
CREATE DATABASE customer_enquiry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Edit `backend/.env` with `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and a strong `JWT_SECRET`.

## Environment setup

Never commit `.env` files. Frontend only needs `VITE_API_BASE_URL`. WhatsApp and JWT secrets stay on the backend.

## Migration and seeding

```bash
cd backend
npm run db:migrate
npm run db:seed
```

Undo last migration:

```bash
npm run db:migrate:undo
```

## Running backend

```bash
cd backend
npm run dev
```

API: `http://localhost:5000`  
Health: `http://localhost:5000/health`

## Running frontend

```bash
cd frontend
npm run dev
```

Customer form: `http://localhost:5173/enquiry`  
QR entry: `http://localhost:5173/enquiry?source=qr`  
Admin: `http://localhost:5173/admin/login`

## Development credentials

**Use only in local development. Change immediately in production.**

- Email: `admin@example.com`
- Password: `Admin@12345`
- Role: `SUPER_ADMIN`

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Production notes

- Set a long random `JWT_SECRET`.
- Disable the seeded admin password; create users through the admin panel.
- Set `WHATSAPP_PROVIDER=http` and provider credentials for live WhatsApp.
- Serve the frontend build (`npm run build`) behind HTTPS.
- Restrict CORS to your real frontend origin.
- Do not expose stack traces (`NODE_ENV=production`).

Payment is intentionally not included. Acknowledgements are enquiry confirmations, not receipts.
