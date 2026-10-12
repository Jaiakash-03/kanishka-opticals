import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CatalogModule } from '../catalog/catalog.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { OrdersModule } from '../orders/orders.module';

@Module({ 
  imports: [CatalogModule, AppointmentsModule, OrdersModule], 
  controllers: [AdminController] 
})
export class AdminModule {}
