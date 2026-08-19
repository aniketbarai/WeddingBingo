# WeddingBingo backend

The backend is an Express 5 and MongoDB service for the WeddingBingo public site and admin panel.

## Setup

Install dependencies:

```bash
npm install
```

Copy the safe environment template and replace the placeholders with local or staging values:

```bash
cp .env.example .env
```

The minimum required variables are `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `FRONTEND_URL`. SMTP variables are required for password-reset notifications. The first administrator is seeded idempotently from the admin variables after MongoDB connects.

Start the backend:

```bash
npm run dev
```

The service listens on `http://localhost:5000` by default.

## Important routes

Public routes are available under `/api`, including `POST /api/send-mail`, `POST /api/booking-requests`, `GET /api/images`, `POST /api/like/:id`, `POST /api/click/:id`, and published content under `/api/public/packages`, `/api/public/testimonials`, and `/api/public/weddings`.

Admin routes are under `/api/admin`. Authentication uses an HTTP-only cookie session. Use `/api/admin/login`, `/api/admin/me`, `/api/admin/logout`, and the protected dashboard, media, audit, and MVP resource endpoints.

Never commit `.env` files, SMTP credentials, database connection strings, JWT secrets, or administrator passwords. Use `.env.example` as the shareable configuration reference.
