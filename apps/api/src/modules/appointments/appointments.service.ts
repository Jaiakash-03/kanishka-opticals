import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AppointmentsService {
  private readonly SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'];
  private readonly MAX_PER_SLOT = 2;

  constructor(private readonly prisma: PrismaService) {}

  async getStores() { return this.prisma.store.findMany({ where: { isActive: true } }); }

  async getAvailableSlots(storeId: string, date: string) {
    const booked = await this.prisma.appointment.groupBy({ by: ['slotTime'], where: { storeId, appointmentDate: new Date(date), status: { notIn: ['CANCELLED', 'NO_SHOW'] } }, _count: { slotTime: true } });
    const bookedMap = Object.fromEntries(booked.map((b) => [b.slotTime, b._count.slotTime]));
    return this.SLOTS.map((time) => ({ time, available: (bookedMap[time] ?? 0) < this.MAX_PER_SLOT, remaining: this.MAX_PER_SLOT - (bookedMap[time] ?? 0) }));
  }

  async book(data: { userId?: string; storeId: string; appointmentDate: string; slotTime: string; guestName?: string; guestPhone?: string; guestEmail?: string; notes?: string }) {
    const slots = await this.getAvailableSlots(data.storeId, data.appointmentDate);
    const slot = slots.find(s => s.time === data.slotTime);
    if (!slot || !slot.available) {
      throw new Error('Selected slot is no longer available');
    }
    return this.prisma.appointment.create({ data: { ...data, appointmentDate: new Date(data.appointmentDate) }, include: { store: true } });
  }

  async getUserAppointments(userId: string) {
    return this.prisma.appointment.findMany({ where: { userId }, orderBy: { appointmentDate: 'desc' }, include: { store: true } });
  }

  async cancel(id: string) {
    return this.prisma.appointment.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async getAll(page = 1, limit = 20) {
    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { store: true, user: { select: { name: true, email: true, phone: true } } },
      }),
      this.prisma.appointment.count(),
    ]);
    return { items: appointments, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.appointment.update({ where: { id }, data: { status } });
  }
}
