import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    username: string;
  };
}

export function authMiddleware(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.auth;
      if (!token) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = verify(token, JWT_SECRET) as {
        userId: string;
        username: string;
      };
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
}
