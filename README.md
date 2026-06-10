# Jericho21q Top-Up

A Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma starter for digital product top-ups. It supports pulsa, data packages, and game voucher catalog flows with checkout, order status tracking, admin visibility, and clean placeholder integration layers for payment gateways and PPOB/top-up providers.

## Features

- Product catalog for pulsa, data packages, and game vouchers.
- Checkout form that accepts a phone number or game ID/server ID.
- Order status page with payment, provider, and activity-log details.
- Admin dashboard for products, recent orders, transaction status, and profit margin.
- Placeholder payment gateway service and webhook endpoint.
- Placeholder PPOB/top-up provider service.
- PostgreSQL data model managed with Prisma.
- Environment-variable based configuration for API keys and secrets.
- Basic structured logging and error handling.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the sample environment file and replace placeholder values with sandbox credentials only:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and set `DATABASE_URL` in `.env`.

4. Run Prisma migrations and seed demo products:

   ```bash
   npx prisma migrate dev --name init
   npm run prisma:generate
   npx prisma db seed
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

## Integration placeholders

- Payment intent creation and webhook verification live in `lib/services/paymentGateway.ts`.
- PPOB/top-up provider submission lives in `lib/services/topupProvider.ts`.
- The webhook endpoint is `POST /api/webhooks/payment` and expects a JSON payload with `paymentReference` and `status`.

No real API keys are included. Keep production secrets in your deployment environment and never commit `.env` files.
