import { AuthenticatedRequest } from '@/lib/authMiddleware';
import type { NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/users';
import { createProtectedHandler } from '@/lib/apiUtils';

const MINING_COOLDOWN = 24 * 60 * 60 * 1000;

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();
    try {
      const { id } = req.body;
      // @ts-ignore
      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({ error: 'User account is not active' });
      }

      const currentTime = new Date();
      const lastActivityTime = new Date(user.lastActivity);
      if (
        user.lastActivity !== null &&
        lastActivityTime &&
        currentTime.getTime() - lastActivityTime.getTime() < MINING_COOLDOWN
      ) {
        return res
          .status(400)
          .json({ error: 'Mining cooldown period has not elapsed' });
      }

      const earnedAmount = user.membership.dailyIncome;
      user.balance += earnedAmount;
      user.earnings.push({
        date: currentTime,
        amount: earnedAmount,
      });
      user.lastActivity = currentTime;

      await user.save();
      return res.status(200).json({
        message: 'Mining successful',
        earnedAmount,
        newBalance: user.balance,
      });
    } catch (error) {
      console.error('Mining error:', error);
      return res.status(500).json({ error: 'An error occurred while mining' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default createProtectedHandler(handler);
