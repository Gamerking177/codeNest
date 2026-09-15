import { Request, Response, NextFunction } from 'express';
import { Permission, Role, hasPermission } from '../types/rbac.js';

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in.',
          requestId: req.id,
        },
      });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Forbidden: You do not possess the required permission '${permission}'`,
          requestId: req.id,
        },
      });
      return;
    }

    next();
  };
}

export function requireRole(allowedRole: Role) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in.',
          requestId: req.id,
        },
      });
      return;
    }

    if (req.user.role !== allowedRole && req.user.role !== Role.SUPER_ADMIN) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Forbidden: Requires role '${allowedRole}'`,
          requestId: req.id,
        },
      });
      return;
    }

    next();
  };
}
