import { Request, Response, NextFunction } from 'express';

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

export function addOwnershipFilter(query: Record<string, unknown>, reqUser: { id: string; role: string }, ownerField = 'createdBy') {
  if (reqUser.role === 'HR') {
    query[ownerField] = reqUser.id
  }
}
