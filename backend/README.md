# Book Shore Backend

Express and Prisma backend for the Book Shore bookstore platform.

## Stack

- Express 5
- TypeScript
- Prisma
- Better Auth
- PostgreSQL
- Redis
- OpenAI

## Getting Started

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Update the database, auth, Redis, and OpenAI credentials
4. Run the development server with `npm run dev`

## Scripts

- `npm run dev` starts the development server
- `npm run build` compiles the project
- `npm run start` runs the compiled server
- `npm run lint` runs TypeScript type-checking
- `npm run prisma:generate` generates the Prisma client
- `npm run prisma:migrate` runs Prisma migrations
- `npm run prisma:seed` seeds the database
