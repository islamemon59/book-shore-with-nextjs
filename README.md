# BookShore 2.0

BookShore is a full-stack AI-powered bookstore platform built as two separate applications inside one repository:

- `frontend/`: Next.js 16 storefront and dashboard
- `backend/`: Express + TypeScript API with Prisma and Better Auth

This repository no longer uses the old root-level learning app. The active implementation lives entirely inside `frontend/` and `backend/`.

## Project Summary

BookShore combines a modern ecommerce bookstore experience with admin and manager operations tools.

It includes:

- Public storefront pages
- Product discovery and book detail pages
- Cart and SSLCommerz-powered checkout
- Login, registration, and role-based dashboard access
- AI tools for copywriting, classification, recommendations, chat, and analytics
- PostgreSQL-ready backend architecture with Prisma
- Optional Redis/BullMQ queue support

## Architecture

### Frontend

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI: Tailwind CSS 4, Radix UI, shadcn-style components
- State: Redux Toolkit
- Server/client data: native `fetch` + TanStack Query
- Notifications: Sonner
- Charts: Recharts

### Backend

- Runtime: Node.js
- Framework: Express 5
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Authentication: Better Auth
- AI: OpenAI Responses API with Zod structured output
- Queue: BullMQ with Redis fallback
- Logging: Pino
- Security: Helmet, CORS, rate limiting, cookie parsing, request validation

## Main Features

- Curated bookstore landing page with spotlight books and store journal content
- Explore page with searchable catalog browsing
- Book details page with metadata, reviews, and AI summary/tags
- Blog pages for editorial and reading content
- Cart management for signed-in users
- Checkout flow using SSLCommerz hosted payment and post-payment validation
- Role-based dashboard for `USER`, `MANAGER`, and `ADMIN`
- AI tools for internal operators and customer-facing recommendations
- Notification system with stream endpoint

## Frontend Page Routes

All frontend routes live under `frontend/src/app`.

### Public Routes

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Homepage with spotlight books, stats, categories, FAQs, and journal posts |
| `/about` | `src/app/about/page.tsx` | About page |
| `/contact` | `src/app/contact/page.tsx` | Contact page |
| `/support` | `src/app/support/page.tsx` | Support/help page |
| `/privacy` | `src/app/privacy/page.tsx` | Privacy page |
| `/explore` | `src/app/explore/page.tsx` | Main catalog browsing page |
| `/books/[slug]` | `src/app/books/[slug]/page.tsx` | Book details page |
| `/blog` | `src/app/blog/page.tsx` | Blog listing page |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | Single blog article page |

### Auth Routes

| Route | File | Purpose |
| --- | --- | --- |
| `/login` | `src/app/login/page.tsx` | User sign-in |
| `/register` | `src/app/register/page.tsx` | User registration |

### Shopping Routes

| Route | File | Purpose |
| --- | --- | --- |
| `/cart` | `src/app/cart/page.tsx` | Signed-in cart view |
| `/checkout` | `src/app/checkout/page.tsx` | Shipping and order info form |
| `/checkout/success` | `src/app/checkout/success/page.tsx` | Post-payment confirmation |
| `/checkout/cancel` | `src/app/checkout/cancel/page.tsx` | Checkout cancellation screen |

### Dashboard Routes

These routes are wrapped by `src/app/dashboard/layout.tsx` and require a valid session.

| Route | File | Purpose |
| --- | --- | --- |
| `/dashboard` | `src/app/dashboard/page.tsx` | Overview metrics, charts, recommendations, assistant, role-aware tables |
| `/dashboard/orders` | `src/app/dashboard/orders/page.tsx` | Order history and order management |
| `/dashboard/catalog` | `src/app/dashboard/catalog/page.tsx` | Catalog management and AI tools for managers/admins |
| `/dashboard/profile` | `src/app/dashboard/profile/page.tsx` | Profile and preference management |
| `/dashboard/insights` | `src/app/dashboard/insights/page.tsx` | AI/business insight surfaces |
| `/dashboard/concierge` | `src/app/dashboard/concierge/page.tsx` | Assistant/recommendation workflow |

### Frontend Internal API Routes

These routes live inside the Next.js app and act as server-side helpers for checkout.

| Route | File | Purpose |
| --- | --- | --- |
| `/api/checkout/session` | `src/app/api/checkout/session/route.ts` | Starts SSLCommerz hosted checkout |
| `/api/checkout/complete` | `src/app/api/checkout/complete/route.ts` | Validates SSLCommerz payment and confirms backend order |
| `/api/checkout/sslcommerz/success` | `src/app/api/checkout/sslcommerz/success/route.ts` | Receives SSLCommerz success callback and redirects to confirmation |

## Backend API Routes

All backend routes are mounted in `backend/src/app.ts` under `/api`.

### Auth

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `ALL` | `/api/auth/*` | Public | Better Auth endpoints for session/auth flows |

### Store

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/store/home` | Public | Homepage data: stats, spotlight books, journal posts |

### Books

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/books` | Public | List/search catalog books |
| `GET` | `/api/books/featured` | Public | Featured books |
| `GET` | `/api/books/categories` | Public | Book categories |
| `GET` | `/api/books/:slug` | Public | Single book details |
| `POST` | `/api/books` | `ADMIN`, `MANAGER` | Create book |
| `PATCH` | `/api/books/:id` | `ADMIN`, `MANAGER` | Update book |

### Blog

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/blog` | Public | List blog posts |
| `GET` | `/api/blog/:slug` | Public | Single blog post |

### Users

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | Authenticated | Current user profile |
| `PATCH` | `/api/users/me` | Authenticated | Update current user profile |
| `PUT` | `/api/users/me/preferences` | Authenticated | Update reading preferences |

### Cart

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/cart` | Authenticated | Get current cart |
| `POST` | `/api/cart` | Authenticated | Add item to cart |
| `PATCH` | `/api/cart/:itemId` | Authenticated | Update item quantity |
| `DELETE` | `/api/cart/:itemId` | Authenticated | Remove item from cart |

### Orders

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/orders` | Authenticated | List current user's orders |
| `POST` | `/api/orders/checkout` | Authenticated | Create order from cart after payment |

### Dashboard

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/dashboard/overview` | Authenticated | Role-aware dashboard overview |
| `GET` | `/api/dashboard/books` | Authenticated, restricted by service logic | Dashboard catalog list |
| `GET` | `/api/dashboard/orders` | Authenticated | Dashboard order list |

### Notifications

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/notifications` | Authenticated | List notifications |
| `POST` | `/api/notifications/mark-all-read` | Authenticated | Mark notifications as read |
| `GET` | `/api/notifications/stream` | Authenticated | Notification stream endpoint |

### AI Tools

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/ai/generate-copy` | `ADMIN`, `MANAGER` | Generate catalog marketing copy |
| `POST` | `/api/ai/classify` | `ADMIN`, `MANAGER` | Classify a book into useful tags |
| `POST` | `/api/ai/recommendations` | Authenticated | Personalized recommendations |
| `POST` | `/api/ai/analyze-dashboard` | `ADMIN`, `MANAGER` | AI-powered business analysis |
| `POST` | `/api/ai/assistant` | Authenticated | Chat assistant for shopping guidance |

### Health

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Service health check |

## Roles and Access

The backend supports three roles:

- `USER`: shopper/reader account
- `MANAGER`: store operations and catalog management
- `ADMIN`: full store administration

Role behavior examples:

- `USER` sees personal dashboard metrics and order history
- `MANAGER` and `ADMIN` can use catalog tools and AI operator features
- protected backend routes are enforced with `requireSession` and `requireRole`

## AI Tools Explained

BookShore includes five main AI capabilities:

### 1. Catalog Copy Generator

Used by `ADMIN` and `MANAGER` users to generate polished ecommerce copy for books.

### 2. Book Classification

Turns a book title and synopsis into structured tags for merchandising and discoverability.

### 3. Recommendations Engine

Uses user preferences, current cart contents, and a catalog snapshot to suggest books.

### 4. Dashboard Analyzer

Reads orders, books, and users to generate operator-focused business insights.

### 5. Shopping Assistant

Maintains AI conversation records and helps users compare titles or find relevant books.

Implementation details:

- OpenAI client is optional and only enabled when `OPENAI_API_KEY` is set
- model defaults to `gpt-5.2`
- output is structured with Zod schemas
- AI chat conversations are stored in the database

## Checkout Flow

BookShore uses a two-step checkout flow:

1. Frontend sends checkout form data to `/api/checkout/session`
2. Next.js route asks the backend to create a pending order and SSLCommerz hosted checkout session
3. User completes payment on SSLCommerz
4. SSLCommerz redirects through `/api/checkout/sslcommerz/success`
5. Frontend calls `/api/checkout/complete` with the SSLCommerz transaction and validation IDs
6. Backend validates the payment and marks the pending order paid

Notes:

- `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD` are required for checkout
- shipping is free for orders above `$100`
- shipping metadata is stored on the pending backend order before payment

## Database Model

The Prisma schema includes these main entities:

- `User`
- `Session`
- `Account`
- `Verification`
- `Category`
- `Book`
- `BookCategory`
- `Review`
- `CartItem`
- `Order`
- `OrderItem`
- `BlogPost`
- `UserPreference`
- `Notification`
- `AIConversation`
- `AIMessage`

### Core Domain Relationships

- users have sessions, accounts, preferences, cart items, orders, notifications, and AI conversations
- books belong to many categories through `BookCategory`
- books can have many reviews, cart items, and order items
- orders contain many order items
- AI conversations contain many AI messages

## Seeded Demo Data

The backend seed script creates a realistic starter dataset:

- 6 categories
- 12 books
- 4 blog posts
- 5 reviews
- sample cart items
- sample orders across several months
- sample notifications
- 3 demo users with roles

### Demo Accounts

- `admin@bookshore.dev / Admin123!`
- `manager@bookshore.dev / Manager123!`
- `reader@bookshore.dev / Reader123!`

## Environment Variables

### Backend Environment

Copy `backend/.env.example` to `backend/.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime environment |
| `PORT` | No | Backend port, default `5000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Optional | Direct database connection for Prisma |
| `FRONTEND_URL` | Yes | Allowed frontend origin |
| `BETTER_AUTH_URL` | Yes | Backend auth base URL |
| `BETTER_AUTH_SECRET` | Yes | Better Auth secret |
| `GOOGLE_CLIENT_ID` | Optional | Google social auth |
| `GOOGLE_CLIENT_SECRET` | Optional | Google social auth |
| `FACEBOOK_CLIENT_ID` | Optional | Facebook social auth |
| `FACEBOOK_CLIENT_SECRET` | Optional | Facebook social auth |
| `OPENAI_API_KEY` | Optional | Enables AI features |
| `OPENAI_MODEL` | No | OpenAI model, default `gpt-5.2` |
| `REDIS_URL` | Optional | Enables BullMQ queue support |
| `SSLCOMMERZ_STORE_ID` | Yes for checkout | SSLCommerz store ID |
| `SSLCOMMERZ_STORE_PASSWORD` | Yes for checkout | SSLCommerz store password |
| `SSLCOMMERZ_SANDBOX` | Optional | Use sandbox endpoints, default `true` |
| `SSLCOMMERZ_CURRENCY` | Optional | Payment currency, default `BDT` |

### Frontend Environment

Copy `frontend/.env.example` to `frontend/.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Browser-visible backend base URL |
| `NEXT_PUBLIC_AUTH_BASE_URL` | Yes | Browser-visible Better Auth URL |
| `API_BASE_URL` | Yes | Server-side backend base URL |
| `NEXT_PUBLIC_SSLCOMMERZ_ENABLED` | Optional | Set to `false` to hide live payment while configuring SSLCommerz |

## Local Development

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Backend default URL:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:3000
```

## Available Scripts

### Backend Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Frontend Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Note:

- there is currently no active root `package.json` workspace script runner
- run scripts inside `frontend/` and `backend/` separately

## Project Structure

```text
book-shore-with-nextjs/
  README.md
  frontend/
    src/
      app/                 Next.js routes, layouts, route handlers
      components/          UI and feature components
      lib/                 config, auth helpers, API helpers, store, types
    public/                static assets
  backend/
    prisma/
      schema.prisma        database schema
      seed.ts              demo data seeding
    src/
      config/              env parsing
      lib/                 prisma, auth, queue, logger, openai, cache
      middlewares/         auth, roles, errors, validation
      modules/             domain modules and route groups
      utils/               shared HTTP helpers
```

## Important Implementation Notes

- homepage data is cached server-side in the backend store service
- frontend uses both server-side fetch helpers and client-side fetch helpers
- dashboard pages use session-aware server fetching
- Better Auth is hosted from the backend, not from the frontend
- Redis is optional; if unavailable, queue behavior falls back safely
- the frontend allows remote images from `images.unsplash.com`
- the app currently forces a light theme in `AppProviders`

## Key Files

### Frontend

- `frontend/src/app/page.tsx`: homepage
- `frontend/src/app/dashboard/page.tsx`: dashboard overview
- `frontend/src/app/layout.tsx`: app shell and metadata
- `frontend/src/components/providers/app-providers.tsx`: theme, Redux, Query, toaster providers
- `frontend/src/lib/server-api.ts`: server-side backend fetch helpers
- `frontend/src/lib/client-api.ts`: client-side fetch helper

### Backend

- `backend/src/app.ts`: Express app and route mounting
- `backend/src/server.ts`: server bootstrap and shutdown
- `backend/src/config/env.ts`: env validation
- `backend/src/lib/auth.ts`: Better Auth configuration
- `backend/src/lib/openai.ts`: OpenAI setup
- `backend/src/lib/queue.ts`: BullMQ/Redis queue setup
- `backend/prisma/schema.prisma`: data model
- `backend/prisma/seed.ts`: demo content and accounts

## Current Project Identity

BookShore is not just a bookstore demo. It is structured like a production-oriented ecommerce platform with:

- real auth architecture
- modular backend services
- SSR-friendly frontend data loading
- AI-assisted internal operations
- customer-facing shopping assistance
- realistic seed data for demos and development

If you want, the next improvement can be a separate `docs/` folder with:

- API request/response examples
- database ERD notes
- frontend component map
- deployment guide
