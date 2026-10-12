import { Injectable, NotFoundException } from '@nestjs/common';
import type { User, UserRole } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  }

  async create(data: {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  }

  async findAll(page = 1, limit = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, isActive: true, createdAt: true },
      }),
      this.prisma.user.count(),
    ]);
    return { items: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _ph, twoFaSecret: _2fa, ...safe } = user;
    void _ph; void _2fa;
    return safe;
  }
}
