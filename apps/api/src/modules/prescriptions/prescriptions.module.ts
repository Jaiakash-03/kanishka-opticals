import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({ imports: [MulterModule.register({ limits: { fileSize: 10 * 1024 * 1024 } })], controllers: [PrescriptionsController], providers: [PrescriptionsService] })
export class PrescriptionsModule {}
