# Kanishka Opticals – E-Commerce Platform

A production-grade, full-stack e-commerce solution tailored for optical stores. Built with **Next.js** (Frontend) and **NestJS** (Backend) in a Turborepo monorepo.

---

## 🏗 Architecture & Tech Stack

This project is built using a modern **Monolithic API** and **Server-Side Rendered (SSR)** web interface, structured within a Turborepo workspace.

### Core Technologies:
*   **Frontend (Storefront & Admin):** Next.js (App Router), React, Tailwind CSS, Zustand (state management), Lucide (icons).
*   **Backend (API):** NestJS, TypeScript, REST APIs, Swagger (OpenAPI).
*   **Database:** PostgreSQL managed via Prisma ORM.
*   **Search Engine:** Meilisearch (for fast, typo-tolerant product searches).
*   **Background Jobs / Cache:** Redis (BullMQ queues).
*   **Payment Gateway:** Razorpay (UPI, Cards, Netbanking).
*   **Storage:** S3-compatible Object Storage (for images and prescriptions).
*   **Deployment:** Docker-containerized, ready for horizontal scaling (AWS/Render/VPS).

### Monorepo Structure:
```text
/
├── apps/
│   ├── web/             # Next.js Frontend (Storefront & Admin Dashboard)
│   └── api/             # NestJS Backend API
├── packages/
│   ├── shared-types/    # Shared TypeScript Interfaces (DTOs, Enums) between web and api
│   ├── eslint-config/   # Shared linting configuration
│   └── tsconfig/        # Shared TypeScript configs
└── docker-compose.yml   # Local environment setup (Postgres, Redis, Meilisearch)
```

---

## 🚀 Developer Guide: Running Locally

### Prerequisites
*   Node.js (v18+)
*   [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
*   Docker & Docker Compose

### 1. Install Dependencies
From the root of the project:
```bash
pnpm install
```

### 2. Start Infrastructure (Database, Redis, Meilisearch)
Spin up the local services using Docker Compose:
```bash
docker-compose up -d
```
*   **PostgreSQL:** `localhost:5432`
*   **Redis:** `localhost:6379`
*   **Meilisearch:** `localhost:7700`

### 3. Setup Environment Variables
Copy the example files and populate them with your credentials.
```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env
```
*(Ensure `DATABASE_URL`, `MEILISEARCH_MASTER_KEY`, and Razorpay keys are properly set in `.env`)*

### 4. Database Migrations
Push the database schema using Prisma:
```bash
cd apps/api
pnpm prisma db push
# Or, to run formal migrations: pnpm prisma migrate dev
```

### 5. Start Development Servers
Start both the Frontend and Backend concurrently from the root directory:
```bash
pnpm run dev
```
*   **Storefront / Admin:** [http://localhost:3000](http://localhost:3000)
*   **Backend API:** [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
*   **Swagger API Docs:** [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## 📚 API Reference (Swagger)

The backend exposes a fully documented OpenAPI (Swagger) interface. 
When the backend is running, visit **[http://localhost:4000/api-docs](http://localhost:4000/api-docs)** to:
*   View all available REST endpoints (`/api/v1/*`).
*   Check required payload schemas and response types.
*   Test API requests directly from the browser (Authentication required for protected routes).

---

## 🚢 Deployment Guide (Production)

The application is designed to be fully stateless and can be deployed on AWS (Mumbai), Render, Railway, or a VPS.

1.  **Database & Cache:** Spin up managed PostgreSQL and Redis instances.
2.  **Environment Variables:** Configure the production `.env` files with strict secrets, live Razorpay keys, and proper S3 bucket credentials.
3.  **Build Phase:**
    ```bash
    pnpm run build
    ```
4.  **Database Migration (Production):**
    ```bash
    cd apps/api && pnpm prisma migrate deploy
    ```
5.  **Start Services:**
    *   **API:** `cd apps/api && pnpm run start:prod` (or deploy via Dockerfile)
    *   **Web:** `cd apps/web && pnpm run start` (or deploy to Vercel/AWS Amplify)

---

## 👑 Client Admin Guide (For Kanishka Opticals)

To access the administrative tools, ensure your user account is granted the `ADMIN` role in the database. 
Log in at the regular `/auth/login` page, then navigate to `/admin`.

### 1. Managing Products (Bulk Import)
*   Go to **Admin Dashboard -> Products**.
*   Click the **Import** button.
*   Upload your standard CSV/Excel file containing product columns: `[name, brand, category, price, MRP, size, colour, material, frame shape, gender, stock, SKU, description, image URLs]`.
*   The system will automatically validate the data, create new products, map the categories/brands, and generate variants.

### 2. Processing Orders
*   Go to **Admin Dashboard -> Orders**.
*   View all incoming orders, their payment status (e.g., `CAPTURED`, `PENDING`), and shipping details.
*   Use the dropdown menu to update the status (e.g., from `PENDING` to `PROCESSING` to `SHIPPED` and finally `DELIVERED`).

### 3. Managing Eye Test Appointments
*   Go to **Admin Dashboard -> Appointments**.
*   Review bookings made by customers.
*   Update the status to `CONFIRMED`, `COMPLETED`, or `CANCELLED` as customers visit the physical store.

### 4. General Tips
*   **Prescriptions:** Customers upload their lens prescriptions securely. They are linked to their orders and can be viewed securely by the administration to process lens orders.
*   **Feature Flags:** (Upcoming) The platform supports feature flagging to safely turn on new features (like Virtual Try-on or specific discounts) without requiring downtime.
