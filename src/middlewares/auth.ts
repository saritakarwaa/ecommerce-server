import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from "express";

interface UserPayload {
  id: string;
  role: string;
}

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (roles: string[] = []): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      if (!decoded.role) {
        res.status(403).json({ message: 'Role not present in token' });
        return;
      }
      if (roles.length && !roles.includes(decoded.role)) {
        res.status(403).json({ message: 'Insufficient permissions' });
        return;
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: 'Invalid token' });
      } else if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Token expired' });
      } else {
        res.status(500).json({ message: 'Authentication failed' });
      }
    }
  };
};
