/**
 * Typed application configuration.
 * All values come from environment variables validated at startup.
 */
export const configuration = () => ({
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  apiUrl: process.env['API_URL'] ?? 'http://localhost:3001',
  webUrl: process.env['WEB_URL'] ?? 'http://localhost:3000',
  apiPrefix: process.env['API_PREFIX'] ?? '/api/v1',

  security: {
    jwtSecret: process.env['JWT_SECRET']!,
    jwtAccessExpiry: process.env['JWT_ACCESS_EXPIRY'] ?? '15m',
    jwtRefreshSecret: process.env['JWT_REFRESH_SECRET']!,
    jwtRefreshExpiry: process.env['JWT_REFRESH_EXPIRY'] ?? '7d',
    cookieSecret: process.env['COOKIE_SECRET']!,
    bcryptRounds: parseInt(process.env['BCRYPT_ROUNDS'] ?? '12', 10),
    admin2FaAppName: process.env['ADMIN_2FA_APP_NAME'] ?? 'KanishkaOpticals',
  },

  database: {
    url: process.env['DATABASE_URL']!,
    readUrl: process.env['DATABASE_READ_URL'],
  },

  redis: {
    url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
    tls: process.env['REDIS_TLS'] === 'true',
    password: process.env['REDIS_PASSWORD'],
  },

  meilisearch: {
    host: process.env['MEILISEARCH_HOST'] ?? 'http://localhost:7700',
    masterKey: process.env['MEILISEARCH_MASTER_KEY']!,
  },

  aws: {
    region: process.env['AWS_REGION'] ?? 'ap-south-1',
    accessKeyId: process.env['AWS_ACCESS_KEY_ID']!,
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']!,
    s3Bucket: process.env['AWS_S3_BUCKET']!,
    s3BucketPrivate: process.env['AWS_S3_BUCKET_PRIVATE']!,
    cdnUrl: process.env['CDN_URL'] ?? '',
  },

  razorpay: {
    keyId: process.env['RAZORPAY_KEY_ID']!,
    keySecret: process.env['RAZORPAY_KEY_SECRET']!,
    webhookSecret: process.env['RAZORPAY_WEBHOOK_SECRET']!,
  },

  email: {
    provider: process.env['EMAIL_PROVIDER'] ?? 'sendgrid',
    sendgridApiKey: process.env['SENDGRID_API_KEY'],
    from: process.env['EMAIL_FROM'] ?? 'noreply@kanishkaopticals.in',
    fromName: process.env['EMAIL_FROM_NAME'] ?? 'Kanishka Opticals',
    smtpHost: process.env['SMTP_HOST'],
    smtpPort: parseInt(process.env['SMTP_PORT'] ?? '587', 10),
    smtpUser: process.env['SMTP_USER'],
    smtpPass: process.env['SMTP_PASS'],
  },

  sms: {
    msg91AuthKey: process.env['MSG91_AUTH_KEY']!,
    msg91SenderId: process.env['MSG91_SENDER_ID'] ?? 'KNSHKA',
    msg91OtpTemplateId: process.env['MSG91_OTP_TEMPLATE_ID']!,
    msg91OrderTemplateId: process.env['MSG91_ORDER_TEMPLATE_ID']!,
  },

  throttle: {
    ttl: parseInt(process.env['THROTTLE_TTL'] ?? '60000', 10),
    limit: parseInt(process.env['THROTTLE_LIMIT'] ?? '100', 10),
    authLimit: parseInt(process.env['AUTH_THROTTLE_LIMIT'] ?? '5', 10),
  },

  store: {
    name: process.env['STORE_NAME'] ?? 'Kanishka Opticals',
    city: process.env['STORE_CITY'] ?? 'Coimbatore',
    state: process.env['STORE_STATE'] ?? 'Tamil Nadu',
    country: process.env['STORE_COUNTRY'] ?? 'India',
    gstNumber: process.env['STORE_GST_NUMBER'] ?? 'PLACEHOLDER_GST',
    supportEmail: process.env['STORE_SUPPORT_EMAIL'] ?? 'support@kanishkaopticals.in',
    supportPhone: process.env['STORE_SUPPORT_PHONE'] ?? '',
  },

  sentry: {
    dsn: process.env['SENTRY_DSN'],
    environment: process.env['SENTRY_ENVIRONMENT'] ?? 'development',
  },
});

export type AppConfig = ReturnType<typeof configuration>;
