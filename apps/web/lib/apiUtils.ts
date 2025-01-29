import { NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from './authMiddleware';

export function createProtectedHandler(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) {
  return authMiddleware(handler);
}
