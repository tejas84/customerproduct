# Setup

## 1. Create the database

```sql
CREATE DATABASE customer_enquiry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'enquiry_app'@'localhost' IDENTIFIED BY 'choose-a-password';
GRANT ALL ON customer_enquiry.* TO 'enquiry_app'@'localhost';
FLUSH PRIVILEGES;
```

You may also use the `root` user locally.

## 2. Backend

```bash
cd backend
copy .env.example .env
```

Set at least:

- `DB_*`
- `JWT_SECRET` (long random string)
- `FRONTEND_URL` / `CORS_ORIGIN`
- `COMPANY_NAME`

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Health check: `GET http://localhost:5000/health`

## 3. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open:

- Customer form: http://localhost:5173/enquiry
- QR URL: http://localhost:5173/enquiry?source=qr
- Admin: http://localhost:5173/admin/login

## 4. Development login

- Email: `admin@example.com`
- Password: `Admin@12345`

Do not use this password in production.

## 5. WhatsApp

Leave `WHATSAPP_PROVIDER=mock` for local development. Messages are recorded as SENT with a mock provider id.

For a live provider:

```
WHATSAPP_PROVIDER=http
WHATSAPP_API_URL=https://graph.facebook.com/v21.0
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WEBHOOK_SECRET=
```

If WhatsApp fails, the enquiry is still stored. Admins can retry from the enquiry detail page or WhatsApp logs.

## 6. Production

- `NODE_ENV=production`
- Unique `JWT_SECRET`
- HTTPS
- Restrict CORS
- Rotate the seeded admin user
- Back up MySQL
- Keep `backend/storage` writable for PDFs
