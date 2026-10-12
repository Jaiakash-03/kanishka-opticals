# Stage 7 — Documentation and Handover

## 1. Developer Documentation
- [x] Write a `README.md` at the project root explaining the monorepo structure.
- [x] Add instructions for running the app locally using Docker and `pnpm run dev`.
- [x] Add deployment instructions and database migration guide.

## 2. API & Architecture Docs
- [x] Document the architecture (NestJS + Next.js + Meilisearch + PostgreSQL).
- [x] Provide an API Reference or point to the Swagger documentation endpoint (`/api-docs`).

## 3. Client Guide
- [x] Write a quick "Admin Guide" section in the README explaining how the client can manage products, check orders, and use the dashboard.

# Stage 8 — Final Review & Mistakes Avoided
- [x] No secrets in code: We strictly used `.env.example` and `ConfigService`.
- [x] Optimization: Setup WebP/AVIF generation in `StorageService` using `sharp`.
- [x] Payment edge cases: Webhooks map Razorpay's `payment.failed` securely.
- [x] Next.js caching: Used Suspense and Client/Server components effectively.
- [x] Database querying: Indexed attributes efficiently via Prisma (`categoryId`, `price`).
