import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: Prisma.PrescriptionCreateWithoutUserInput) {
    return this.prisma.prescription.create({ data: { ...data, userId, consentAt: data.consentGiven ? new Date() : null } });
  }

  async findAll(userId: string) {
    return this.prisma.prescription.findMany({ where: { userId, deletionRequestedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, userId: string) {
    const rx = await this.prisma.prescription.findFirst({ where: { id, userId } });
    if (!rx) throw new NotFoundException('Prescription not found');
    return rx;
  }

  async requestDeletion(id: string, userId: string) {
    const rx = await this.prisma.prescription.findFirst({ where: { id, userId } });
    if (!rx) throw new NotFoundException('Prescription not found');
    return this.prisma.prescription.update({ where: { id }, data: { deletionRequestedAt: new Date() } });
  }
}
