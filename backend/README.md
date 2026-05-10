# BookShore Backend

Production-ready Express and Prisma backend for the BookShore bookstore platform. It powers catalog browsing, authentication, user profiles, carts, checkout, dashboard views, notifications, and AI-assisted bookstore workflows.

## Highlights

- Express 5 API written in TypeScript
- Prisma ORM with PostgreSQL
- Better Auth for email/password and optional Google/Facebook login
- Redis-backed BullMQ queue with an in-memory fallback for local development
- OpenAI-powered recommendation and content endpoints
- SSLCommerz checkout support for order payments
- Vercel-compatible serverless entrypoint in `api/index.ts`

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma
- PostgreSQL
- Better Auth
- BullMQ
- Redis
- OpenAI
- Zod
- Pino

## Project Structure

```text
.
+-- api/                  # Vercel serverless entrypoint
+-- prisma/
|   +-- schema.prisma     # Database schema
|   +-- seed.ts           # Demo data seed
+-- src/
|   +-- config/           # Environment loading and validation
|   +-- lib/              # Prisma, auth, OpenAI, queue, payment helpers
|   +-- middlewares/      # Auth, role, validation, error handling
|   +-- modules/          # Route modules by feature
|   +-- types/            # Express type extensions
|   +-- app.ts            # Express app wiring
|   +-- server.ts         # Local server bootstrap
+-- .env.example
+-- package.json
+-- vercel.json
```

## Features

### Storefront

- Homepage aggregation endpoint
- Book listing, featured books, categories, and single-book detail
- Blog listing and blog post detail

### Accounts and User Data

- Better Auth endpoints mounted at `/api/auth/*`
- Current user profile and reading preference updates
- Role-aware access for `USER`, `MANAGER`, and `ADMIN`

### Commerce

- Persistent cart management
- Order creation and order history
- SSLCommerz checkout session creation and payment completion

### Operations

- Dashboard overview, books, and order reporting
- Notification listing, mark-all-read, and stream endpoint
- Automatic admin bootstrap at startup

### AI

- Marketing copy generation
- Book classification
- Personalized recommendations
- Dashboard analysis
- Assistant chat

## Prerequisites

- Node.js 20+ recommended
- PostgreSQL database
- Redis optional for queue-backed jobs
- OpenAI API key optional unless you want AI endpoints enabled
- SSLCommerz credentials optional unless you want hosted checkout enabled

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

Copy `.env.example` to `.env.local` and update the values for your machine and services.

### 3. Configure the database

Generate the Prisma client and run your development migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

If you want demo catalog, blog, orders, and test users, seed the database:

```bash
npm run prisma:seed
```

### 4. Start the API

```bash
npm run dev
```

The local server starts on `http://localhost:5000` by default.

## Environment Variables

The app loads `.env` first and then `.env.local`, with `.env.local` taking priority.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No | `development`, `test`, or `production` |
| `PORT` | No | Local server port. Defaults to `5000` |
| `DATABASE_URL` | Yes | Primary PostgreSQL connection string |
| `DIRECT_URL` | Usually | Direct PostgreSQL URL for Prisma migrations |
| `FRONTEND_URL` | Yes | Frontend origin used for CORS and payment redirects |
| `BETTER_AUTH_URL` | Yes | Public backend base URL for Better Auth |
| `BETTER_AUTH_SECRET` | Yes | Auth signing secret, minimum 16 characters |
| `GOOGLE_CLIENT_ID` | No | Enables Google sign-in when paired with secret |
| `GOOGLE_CLIENT_SECRET` | No | Enables Google sign-in |
| `FACEBOOK_CLIENT_ID` | No | Enables Facebook sign-in when paired with secret |
| `FACEBOOK_CLIENT_SECRET` | No | Enables Facebook sign-in |
| `OPENAI_API_KEY` | No | Required for AI endpoints |
| `OPENAI_MODEL` | No | Defaults to `gpt-5.2` |
| `REDIS_URL` | No | Enables BullMQ queue + worker |
| `SSLCOMMERZ_STORE_ID` | No | Required for SSLCommerz checkout |
| `SSLCOMMERZ_STORE_PASSWORD` | No | Required for SSLCommerz checkout |
| `SSLCOMMERZ_SANDBOX` | No | `true` for sandbox, `false` for live |
| `SSLCOMMERZ_CURRENCY` | No | Defaults to `BDT` |
| `ADMIN_NAME` | No | Startup admin display name |
| `ADMIN_EMAIL` | No | Startup admin email |
| `ADMIN_PASSWORD` | No | Startup admin password |
| `ADMIN_IMAGE` | No | Startup admin avatar URL |

## Startup Behavior

- On boot, the app validates environment variables with Zod and fails fast if required values are missing.
- Prisma connects before the server begins accepting requests.
- An admin user is ensured automatically at startup.
- If `REDIS_URL` is not provided, the queue falls back to an in-memory implementation so local development still works.

## Seeded Demo Accounts

When you run `npm run prisma:seed`, these users are created:

- `admin@bookshore.dev / Admin123!`
- `manager@bookshore.dev / Manager123!`
- `reader@bookshore.dev / Reader123!`

## Available Scripts

- `npm run dev` starts the backend in watch mode with `tsx`
- `npm run build` compiles TypeScript into `dist/`
- `npm run start` runs the compiled server
- `npm run lint` runs TypeScript type-checking
- `npm run prisma:generate` generates the Prisma client
- `npm run prisma:migrate` runs Prisma development migrations
- `npm run prisma:seed` seeds the database with demo data

## API Overview

Base URL locally: `http://localhost:5000`

| Area | Base Path | Notes |
| --- | --- | --- |
| Root | `/` | Basic status payload with health link |
| Health | `/api/health` | Liveness/status endpoint |
| Auth | `/api/auth/*` | Better Auth handler |
| Store | `/api/store` | Homepage content |
| Books | `/api/books` | Catalog, featured books, categories, admin-managed create/update |
| Blog | `/api/blog` | Blog listing and detail |
| Users | `/api/users` | Current user profile and preferences |
| Cart | `/api/cart` | Authenticated cart management |
| Orders | `/api/orders` | Checkout flow and order history |
| Dashboard | `/api/dashboard` | Authenticated dashboard data |
| Notifications | `/api/notifications` | Notifications list, read state, streaming |
| AI | `/api/ai` | Authenticated recommendation and generation features |

## Authentication and Roles

- Better Auth is mounted before `express.json()` at `/api/auth/{*any}`.
- Session-protected endpoints use Better Auth session resolution from request headers.
- Role-restricted routes are limited to `ADMIN` and `MANAGER` where needed, especially for catalog management and some AI tools.

## Database Notes

The Prisma schema includes models for:

- Users, sessions, and linked auth accounts
- Categories, books, reviews, and book-category joins
- Cart items, orders, and order items
- Blog posts
- User preferences
- Notifications
- AI conversations and messages

## Deployment

### Local Node server

Use `src/server.ts` via:

```bash
npm run dev
```

or:

```bash
npm run build
npm run start
```

### Vercel

The repository includes:

- `vercel.json`
- `api/index.ts`

`api/index.ts` initializes Prisma and the startup admin flow, then hands off requests to the Express app. `vercel.json` rewrites all incoming routes to `/api`.

## Notes for Frontend Integration

- Set `FRONTEND_URL` to your Next.js app origin so CORS and payment redirects work correctly.
- Set `BETTER_AUTH_URL` to the public backend origin, not the frontend origin.
- The frontend should send credentials/cookies for session-backed authenticated requests.
- SSLCommerz success and cancel URLs redirect back through the frontend checkout flow.

## Troubleshooting

- If the server exits on startup, check `.env.local` first. Environment validation is strict.
- If auth works inconsistently across origins, verify `FRONTEND_URL`, `BETTER_AUTH_URL`, and cookie settings in your frontend requests.
- If queue logs mention Redis connection issues, the app can still run locally without Redis.
- If AI routes fail, confirm `OPENAI_API_KEY` is present.
- If hosted checkout fails, verify the SSLCommerz credentials and whether sandbox mode matches your account.
