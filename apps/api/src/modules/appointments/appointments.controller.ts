import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Public } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('appointments')
@Controller({ path: 'appointments', version: '1' })
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Public() @Get('stores') @ApiOperation({ summary: 'Get store locations' })
  getStores() { return this.appointmentsService.getStores(); }

  @Public() @Get('slots') @ApiOperation({ summary: 'Get available slots for a store + date' })
  getSlots(@Query('storeId') storeId: string, @Query('date') date: string) { return this.appointmentsService.getAvailableSlots(storeId, date); }

  @Public() @Post() @ApiOperation({ summary: 'Book an eye test appointment' })
  book(@Body() body: Parameters<AppointmentsService['book']>[0], @CurrentUser() user: { id?: string }) {
    return this.appointmentsService.book({ ...body, userId: user?.id });
  }

  @Get('my') @ApiOperation({ summary: 'Get my appointments' })
  getMyAppointments(@CurrentUser() user: { id: string }) { return this.appointmentsService.getUserAppointments(user.id); }

  @Delete(':id') @ApiOperation({ summary: 'Cancel appointment' })
  cancel(@Param('id') id: string) { return this.appointmentsService.cancel(id); }
}
