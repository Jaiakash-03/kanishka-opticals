/**
 * Application entry point.
 * Configures NestJS server with security middleware, compression, Swagger docs,
 * global pipes/filters/interceptors, and graceful shutdown.
 */
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const port = configService.get<number>('PORT', 3001);
  const webUrl = configService.get<string>('WEB_URL', 'http://localhost:3000');

  // ── Security headers ────────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // Required for Swagger UI
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    }),
  );

  // ── CORS ────────────────────────────────────────────────────────────────────
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', webUrl)
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,          // Allow HttpOnly cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
  });

  // ── Middleware ───────────────────────────────────────────────────────────────
  app.use(compression());
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));

  // ── Global prefix & versioning ───────────────────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ── Global pipes (request validation) ───────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,           // Auto-transform payloads to DTO classes
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global filters & interceptors ────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Swagger (API docs) — disabled in production ───────────────────────────────
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Kanishka Opticals API')
      .setDescription(
        'REST API for Kanishka Opticals e-commerce platform. ' +
          'All endpoints versioned under /api/v1.',
      )
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
      .addTag('auth', 'Authentication & authorization')
      .addTag('catalog', 'Products, categories, brands')
      .addTag('cart', 'Shopping cart')
      .addTag('orders', 'Order management')
      .addTag('payments', 'Razorpay payments & webhooks')
      .addTag('prescriptions', 'Prescription vault')
      .addTag('appointments', 'Eye test bookings')
      .addTag('admin', 'Admin-only endpoints')
      .addTag('search', 'Full-text search')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log(`Swagger docs available at http://localhost:${port}/api/v1/docs`);
  }

  // ── Graceful shutdown ────────────────────────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`🚀 API running in [${nodeEnv}] mode on http://localhost:${port}/api/v1`);
}

void bootstrap();
