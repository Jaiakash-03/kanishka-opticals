import {
  Controller, Post, Body, HttpCode, HttpStatus,
  Req, Res, UseGuards, Get,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '@kanishka/shared-types';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Register a new customer account */
  @Public()
  @Post('register')
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @ApiOperation({ summary: 'Register a new customer' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** Login with email + password */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @ApiOperation({ summary: 'Login and receive JWT tokens' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    // Store refresh token in HttpOnly cookie (XSS safe)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth/refresh',
    });
    return { accessToken: result.accessToken, expiresIn: result.expiresIn, user: result.user };
  }

  /** Refresh access token using HttpOnly cookie */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using cookie' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refreshToken as string | undefined;
    const result = await this.authService.refreshTokens(token ?? '');
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });
    return { accessToken: result.accessToken, expiresIn: result.expiresIn };
  }

  /** Logout — clears refresh token cookie */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout and clear refresh token cookie' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  /** Get current authenticated user's profile */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: AuthUser) {
    return user;
  }

  /** Send OTP to phone for verification */
  @Public()
  @Post('send-otp')
  @Throttle({ auth: { ttl: 60_000, limit: 3 } })
  @ApiOperation({ summary: 'Send OTP to phone number' })
  async sendOtp(@Body('phone') phone: string) {
    return this.authService.sendOtp(phone);
  }

  /** Verify OTP */
  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone OTP' })
  async verifyOtp(
    @Body('phone') phone: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOtp(phone, otp);
  }

  /** Send forgot password email */
  @Public()
  @Post('forgot-password')
  @Throttle({ auth: { ttl: 60_000, limit: 3 } })
  @ApiOperation({ summary: 'Send password reset email' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  /** Reset password with token from email */
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using email token' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
