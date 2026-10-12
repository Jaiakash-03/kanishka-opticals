import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@kanishka/shared-types';

@ApiTags('admin')
@Controller({ path: 'admin/import', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth('access-token')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('products')
  @ApiOperation({ summary: '[Admin] Bulk import products from CSV/Excel' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  importProducts(@UploadedFile() file: Express.Multer.File) {
    return this.importService.importFromBuffer(file.buffer, file.mimetype);
  }
}
