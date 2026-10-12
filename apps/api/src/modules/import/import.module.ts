import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { CatalogModule } from '../catalog/catalog.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({ imports: [CatalogModule, MulterModule.register({ limits: { fileSize: 50 * 1024 * 1024 } })], controllers: [ImportController], providers: [ImportService] })
export class ImportModule {}
