import dbConnect from '../../lib/dbConnect';
import Deposits from '../../models/deposits';
import type { NextApiResponse } from 'next';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { createProtectedHandler } from '@/lib/apiUtils';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    const { page, limit, filters } = req.query as any;
    const query = JSON.parse(filters);
    if (query.status === '') {
      delete query.status;
    }
    try {
      const totalCount = await Deposits.countDocuments(query);
      // @ts-ignore
      const deposits = await Deposits.find(query)
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit)
        .lean();
      // Send the response with the pending deposit-history
      return res.status(200).json({ items: deposits, totalCount });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default createProtectedHandler(handler);
