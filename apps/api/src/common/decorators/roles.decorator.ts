import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@kanishka/shared-types';

/** Metadata key for roles */
export const ROLES_KEY = 'roles';

/**
 * Decorator to restrict an endpoint to specific user roles.
 *
 * Usage:
 *   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 *   @Get('admin-only')
 *   adminOnly() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/** Mark an endpoint as public (skip JWT guard) */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
