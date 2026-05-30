import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authorize users based on their roles.
 * Expects req.user to be populated by the authentication middleware.
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!user.role) {
      res.status(403).json({ success: false, message: "Forbidden: No role assigned" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
      return;
    }

    next();
  };
};
