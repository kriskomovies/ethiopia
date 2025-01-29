import dbConnect from '@/lib/dbConnect';
import Users from '@/models/users';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { createProtectedHandler } from '@/lib/apiUtils';
import type { NextApiResponse } from 'next';
import { getTransformedUser } from '@/lib/userUtils';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await dbConnect();
    const { id } = req?.query as { id: string };

    try {
      // @ts-ignore
      const user = await Users.findById(id).populate('members').lean();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Transform and sort members
      const members = user.members
        .map(getTransformedUser)
        .sort((a: any, b: any) => {
          // Sort ACTIVE status first
          if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
          if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
          // If both have the same status, maintain their original order
          return 0;
        });

      // Respond with the sorted members
      return res.status(200).json({ members });
    } catch (error) {
      console.error('Error fetching members:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Handle other HTTP methods
  return res.status(405).json({ message: 'Method Not Allowed' });
}

export default createProtectedHandler(handler);
