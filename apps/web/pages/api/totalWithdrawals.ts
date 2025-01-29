import { NextApiResponse } from 'next';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { createProtectedHandler } from '@/lib/apiUtils';
import dbConnect from '@/lib/dbConnect';
import Withdrawals from '@/models/withdrawals';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    try {
      const query = {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'confirmed',
      };

      // @ts-ignore
      const withdrawals = await Withdrawals.find(query).lean();

      const totalAmount = withdrawals.reduce(
        (sum: number, withdrawal: any) => sum + withdrawal.amount,
        0,
      );
      return res.status(200).json({
        totalAmount: totalAmount,
      });
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default createProtectedHandler(handler);
