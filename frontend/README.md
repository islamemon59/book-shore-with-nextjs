# BookShore Frontend

BookShore is a modern bookstore frontend built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and a small set of production-oriented shopping flows. The app includes storefront discovery, editorial content, account entry points, a role-aware dashboard, and checkout integration.

## Highlights

- AI-flavored bookstore landing page with curated merchandising
- Explore and detail flows for books and categories
- Cart and checkout experience with SSLCommerz session endpoints
- Authentication-ready login and registration screens
- Dashboard surfaces for catalog, orders, insights, profile, and concierge tools
- Reusable UI primitives built with Radix UI and Tailwind CSS

## Tech Stack

- Next.js 16.2.6
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Redux Toolkit
- TanStack Query
- Better Auth
- SSLCommerz

## Environment Variables

Create a local `.env.local` file from `.env.example` and set the values for your backend environment.

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_AUTH_BASE_URL="http://localhost:5000/api/auth"
API_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_SSLCOMMERZ_ENABLED=true
```

## Getting Started

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
src/app          App Router pages, layouts, route handlers
src/components   Feature and UI components
src/lib          Shared utilities, config, API helpers, store
public           Static assets
```

## Notes

- The frontend expects a backend API running on `http://localhost:5000` by default.
- Remote product imagery is currently configured for `images.unsplash.com`.
- The production build and ESLint checks pass in the current project state.
