import {
  Injectable, UnauthorizedException, ConflictException,
  BadRequestException, NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { AuthTokens } from '@kanishka/shared-types';

@Injectable()
export class AuthService {
  private readonly redis: Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.redis = new Redis(this.config.get<string>('redis.url', 'redis://localhost:6379'));
  }

  async register(dto: RegisterDto) {
    // Check email/phone uniqueness
    const existing = await this.usersService.findByEmailOrPhone(dto.email, dto.phone);
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email
          ? 'Email already registered'
          : 'Phone number already registered',
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      this.config.get<number>('security.bcryptRounds', 12),
    );

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: 'CUSTOMER',
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto): Promise<AuthTokens & { user: object }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    await this.usersService.updateLastLogin(user.id);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) throw new UnauthorizedException('Refresh token required');

    try {
      const payload = this.jwtService.verify<{ sub: string; email: string; role: string }>(
        refreshToken,
        { secret: this.config.get<string>('security.jwtRefreshSecret') },
      );
      return this.generateTokens(payload.sub, payload.email, payload.role as never);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async sendOtp(phone: string): Promise<{ message: string }> {
    // Generate 6-digit OTP
    const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
    
    // Store in Redis with 10-minute TTL
    const redisKey = `otp:${phone}`;
    await this.redis.setex(redisKey, 600, otp);
    
    console.warn(`[DEV] OTP for ${phone}: ${otp}`); // Remove in production
    // TODO: Actually send SMS via MSG91 in NotificationsModule
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ verified: boolean }> {
    const redisKey = `otp:${phone}`;
    const storedOtp = await this.redis.get(redisKey);
    
    if (!storedOtp) {
      throw new BadRequestException('OTP expired or not requested');
    }
    if (storedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    
    // OTP verified successfully, remove from Redis
    await this.redis.del(redisKey);
    
    return { verified: true };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If this email exists, a reset link has been sent' };
    }
    // Generate reset token and store in Redis with 15-min TTL
    const resetToken = crypto.randomUUID();
    await this.redis.setex(`reset:${resetToken}`, 900, user.id);
    
    // TODO: Send via NotificationsService
    console.warn(`[DEV] Reset token for ${email}: ${resetToken}`); 
    return { message: 'If this email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const userId = await this.redis.get(`reset:${token}`);
    if (!userId) {
      throw new BadRequestException('Reset token invalid or expired');
    }
    
    if (newPassword.length < 8) throw new BadRequestException('Password too short');
    
    const passwordHash = await bcrypt.hash(newPassword, this.config.get<number>('security.bcryptRounds', 12));
    await this.usersService.updatePassword(userId, passwordHash);
    
    await this.redis.del(`reset:${token}`);
    return { message: 'Password reset successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('security.jwtSecret'),
        expiresIn: this.config.get<string>('security.jwtAccessExpiry', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('security.jwtRefreshSecret'),
        expiresIn: this.config.get<string>('security.jwtRefreshExpiry', '7d'),
      }),
    ]);
    return { accessToken, refreshToken, expiresIn: 900 }; // 15 min in seconds
  }

  private sanitizeUser(user: { id: string; name: string; email: string; phone: string; role: string; isVerified: boolean; twoFaEnabled: boolean }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      twoFaEnabled: user.twoFaEnabled,
    };
  }
}
