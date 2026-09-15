export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export type Permission =
  | 'program:create'
  | 'program:read'
  | 'program:update'
  | 'program:delete'
  | 'program:share'
  | 'program:favorite'
  | 'profile:read'
  | 'profile:update'
  | 'user:read'
  | 'user:manage'
  | 'audit:read'
  | 'admin:access';

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.USER]: [
    'program:create',
    'program:read',
    'program:update',
    'program:delete',
    'program:share',
    'program:favorite',
    'profile:read',
    'profile:update',
  ],
  [Role.ADMIN]: [
    'program:create',
    'program:read',
    'program:update',
    'program:delete',
    'program:share',
    'program:favorite',
    'profile:read',
    'profile:update',
    'user:read',
    'audit:read',
    'admin:access',
  ],
  [Role.SUPER_ADMIN]: [
    'program:create',
    'program:read',
    'program:update',
    'program:delete',
    'program:share',
    'program:favorite',
    'profile:read',
    'profile:update',
    'user:read',
    'user:manage',
    'audit:read',
    'admin:access',
  ],
} as const;

export function hasPermission(role: Role | string, permission: Permission): boolean {
  const userRole = role as Role;
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}
