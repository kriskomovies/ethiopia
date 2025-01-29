import { NextApiResponse } from 'next';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { createProtectedHandler } from '@/lib/apiUtils';
import dbConnect from '@/lib/dbConnect';
import Withdrawals from '@/models/withdrawals';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    const { page, limit, filters } = req.query as any;
    const query = JSON.parse(filters);
    if (!query.userId || query.userId.trim() === '') {
      delete query.userId;
    }
    if (query.status === '') {
      delete query.status;
    }
    try {
      const totalCount = await Withdrawals.countDocuments(query);
      const sortOption = { createdAt: -1 };
      // @ts-ignore
      const withdrawals = await Withdrawals.find(query)
        .sort(sortOption)
        .skip(page * limit)
        .limit(limit)
        .lean();
      // Send the response with the pending deposit-history
      return res.status(200).json({ items: withdrawals, totalCount });
    } catch (error) {
      return res.status(200).json({ items: [], totalCount: 0 });
    }
  }
}

export default createProtectedHandler(handler);
