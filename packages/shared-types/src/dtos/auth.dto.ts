import type { UserRole } from '../enums';

/** Register a new customer account */
export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

/** Login with email + password */
export interface LoginDto {
  email: string;
  password: string;
}

/** Verify OTP sent to phone */
export interface VerifyOtpDto {
  phone: string;
  otp: string;
}

/** Refresh access token */
export interface RefreshTokenDto {
  refreshToken: string;
}

/** Forgot password — send reset email */
export interface ForgotPasswordDto {
  email: string;
}

/** Reset password with token from email */
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

/** Verify TOTP code for admin 2FA */
export interface VerifyTotpDto {
  code: string;
}

/** Authenticated user payload embedded in JWT */
export interface JwtPayload {
  sub: string;       // User UUID
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Auth token pair returned on login/refresh */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Public user profile returned by auth endpoints */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  twoFaEnabled: boolean;
}
