# Purchase & Integration Checklist for Production

Before Kanishka Opticals can go live, the following items must be purchased or registered. Note that these refer to third-party services and are outside the direct code scope.

## 1. Domain & SSL
- [ ] **Purchase Domain**: E.g., `kanishkaopticals.in` (from GoDaddy, Namecheap, Cloudflare, etc.).
- [ ] **DNS Management**: Highly recommend moving nameservers to Cloudflare for free DDoS protection, CDN, and automatic SSL.
- [ ] **SSL Certificates**: Cloudflare provides flexible SSL. AWS ACM can provide certificates for the backend API if using Application Load Balancers.

## 2. Infrastructure (AWS Mumbai - ap-south-1)
- [ ] **AWS Account Setup**: Register/Login to AWS.
- [ ] **EC2 / ECS / AppRunner**: Choose compute environment. For simplicity, start with EC2 instances or AWS AppRunner.
- [ ] **Managed Database (RDS)**: Provision a PostgreSQL 16 RDS instance in Mumbai.
- [ ] **Redis (ElastiCache)**: Provision a Redis instance for caching, sessions, and BullMQ queues.
- [ ] **S3 Buckets**: Create two S3 buckets:
  - `kanishka-public-assets` (for product images, accessible via Cloudflare CDN).
  - `kanishka-private-data` (for user prescriptions, access blocked, accessed via pre-signed URLs only).

## 3. Payment Gateway (Razorpay)
- [ ] **Register Account**: Create a merchant account on [Razorpay](https://razorpay.com).
- [ ] **Complete KYC**: Requires business PAN, GSTIN, bank details.
- [ ] **Generate Live Keys**: Navigate to Settings -> API Keys -> Generate Key. Replace dummy keys in `.env`.
- [ ] **Configure Webhook**: Set up webhook in Razorpay dashboard pointing to `https://api.kanishkaopticals.in/api/v1/payments/webhook`. Subscribe to `payment.captured` and `payment.failed` events.

## 4. Notifications
- [ ] **Transactional Email (SendGrid / AWS SES)**: Register an account. Verify your domain (e.g., `kanishkaopticals.in`). Generate an API key.
- [ ] **SMS OTP (MSG91 / Fast2SMS)**: Register an account. Get DLT registration for SMS templates (required by TRAI in India). Generate an API key.
- [ ] **WhatsApp Business API (Optional for Phase 2)**: Through providers like Interakt or Wati for order notifications.

## 5. Third-Party Integrations
- [ ] **Meilisearch Cloud**: Easiest way to host Meilisearch (or self-host on a dedicated EC2 instance).
- [ ] **Google Analytics 4**: Create property and get Measurement ID.
- [ ] **Sentry**: For error tracking. Register and get the DSN for both frontend and backend.

## 6. Pre-Launch Updates
- [ ] **Update `.env`**: Ensure ALL placeholder values (keys, secrets, DB URLs) are updated in production environment variables.
- [ ] **GST Number**: Replace placeholder GST details in invoice generation logic (or `.env`).
- [ ] **Security Review**: Ensure `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`. Ensure Prisma `directUrl` is configured if using connection pooling (like PgBouncer).
