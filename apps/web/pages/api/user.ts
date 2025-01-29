import dbConnect from '@/lib/dbConnect';
import Users from '@/models/users';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { createProtectedHandler } from '@/lib/apiUtils';
import type { NextApiResponse } from 'next';
import { getTransformedUser } from '@/lib/userUtils';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await dbConnect();
    const { id } = req?.query as any;
    try {
      // @ts-ignore
      const user = await Users.findById(id).lean();

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      const userObject = getTransformedUser(user);
      return res.status(200).json({ user: userObject });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default createProtectedHandler(handler);
