/**
 * Root application module.
 * Registers all feature modules and shared infrastructure.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import { DatabaseModule } from './database/database.module';
import { configuration } from './config/configuration';
import { envValidationSchema } from './config/env.validation';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { SearchModule } from './modules/search/search.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { ImportModule } from './modules/import/import.module';
import { FlagsModule } from './modules/flags/flags.module';
import { StorageModule } from './modules/storage/storage.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    // ── Configuration ────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: envValidationSchema,
      expandVariables: true,
    }),

    // ── Rate limiting (backed by Redis in production) ─────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,       // 1 minute
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 60_000,
        limit: 5,          // 5 auth attempts per minute per IP
      },
    ]),

    // ── Cron / scheduled jobs ────────────────────────────────────────────────
    ScheduleModule.forRoot(),

    // ── Health checks ────────────────────────────────────────────────────────
    TerminusModule,

    // ── Infrastructure ───────────────────────────────────────────────────────
    DatabaseModule,

    // ── Feature modules ──────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    CatalogModule,
    SearchModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    PrescriptionsModule,
    AppointmentsModule,
    NotificationsModule,
    AdminModule,
    ImportModule,
    FlagsModule,
    StorageModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
