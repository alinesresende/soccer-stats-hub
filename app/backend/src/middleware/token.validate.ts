import { NextFunction, Request, Response } from 'express';

import { decodeToken } from '../utils/jwt';

class ValidateToken {
  static async checkTokenExists(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: 'Token not found',
      });
    }
    next();
  }

  static async checkTokenIsValid(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;
    try {
      const validToken = token.replace('Bearer ', '');
      const payload = decodeToken(validToken);
      if (!payload) return res.status(401).json({ message: 'Token must be a valid token' });

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}

export default ValidateToken;
