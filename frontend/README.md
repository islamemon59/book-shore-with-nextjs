# BookShore Frontend

BookShore is a bookstore frontend built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It combines a public storefront, account flows, a role-aware dashboard, and a checkout experience that hands off payment to a backend-powered SSLCommerz flow.

This repository contains only the frontend application. It expects a compatible backend API to be running separately.

## What this app includes

- Marketing-focused home page with featured books, category shelves, testimonials, FAQs, and editorial content
- Public discovery pages for books, categories, blog posts, support, privacy, and contact
- Authentication entry points for login and registration
- Cart and checkout flow with shipping form validation and hosted payment handoff
- Dashboard pages for catalog, orders, profile, insights, and concierge tools
- Shared UI primitives built with Radix UI and Tailwind CSS

## Tech stack

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4`
- Redux Toolkit
- TanStack Query
- Better Auth client
- Zod
- Radix UI

## Requirements

- Node.js 20 or newer
- npm
- A running BookShore backend API, available locally by default at `http://localhost:5000`

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Update the environment values in `.env.local` if your backend runs somewhere else.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Environment variables

The project currently uses these variables:

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `http://localhost:5000` | Public backend API base URL used by client-side requests |
| `NEXT_PUBLIC_AUTH_BASE_URL` | Yes | `http://localhost:5000/api/auth` | Backend auth base URL used by the auth client |
| `API_BASE_URL` | Recommended | `http://localhost:5000` | Server-side backend API base URL used by Next server components and route handlers |
| `NEXT_PUBLIC_SSLCOMMERZ_ENABLED` | No | `true` | Enables the SSLCommerz payment handoff in checkout |
| `NEXT_PUBLIC_SITE_URL` | No | derived automatically | Optional explicit frontend site URL |
| `NEXT_PUBLIC_APP_URL` | No | derived automatically | Fallback public site URL |

Example:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_AUTH_BASE_URL="http://localhost:5000/api/auth"
API_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_SSLCOMMERZ_ENABLED=true
```

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project structure

```text
src/
  app/                 Next.js App Router pages and local route handlers
  components/          Feature components and reusable UI building blocks
  lib/                 API utilities, auth helpers, store config, content, and types
public/                Static assets
next.config.ts         Next.js config, image settings, and backend rewrites
```

## Application overview

### Main routes

- `/` home page with featured shelves, metrics, FAQs, and journal content
- `/explore` catalog browsing
- `/books/[slug]` book details
- `/blog` and `/blog/[slug]` editorial content
- `/cart` shopping cart
- `/checkout` authenticated checkout
- `/checkout/success` and `/checkout/cancel` payment result screens
- `/login` and `/register` account entry pages
- `/dashboard/*` authenticated dashboard pages

### Backend integration

This frontend depends on a backend API for catalog data, session state, cart data, and checkout processing.

- Server components use `src/lib/server-api.ts` to fetch data directly from `API_BASE_URL`
- Client components use `src/lib/client-api.ts`, which defaults to the frontend proxy path `/api/proxy`
- `next.config.ts` rewrites:
  - `/api/auth/:path*` to the backend auth service
  - `/api/proxy/:path*` to the backend API root

### Checkout flow

The checkout flow is partly handled inside this app:

- `POST /api/checkout/session` validates the shipping payload and asks the backend to create a checkout session
- `GET|POST /api/checkout/sslcommerz/success` accepts the payment gateway callback and redirects the user to the success page
- `POST /api/checkout/complete` finalizes the order with the backend using SSLCommerz transaction identifiers

## Development notes

- The app is configured to load remote images from `images.unsplash.com`
- Checkout requires an authenticated user session before the form is shown
- Some pages are marketing-oriented and use local content plus backend data together
- The repo uses the App Router, so new routes and layouts should follow the `src/app` structure

## Deployment notes

- Set all environment variables for the deployed frontend environment
- Ensure the backend API is reachable from the deployed Next.js server
- If you deploy on Vercel, `VERCEL_URL` is used automatically as a fallback for the public site URL

## License

No license file is currently included in this repository.
