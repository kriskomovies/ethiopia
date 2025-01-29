import { AuthenticatedRequest } from '@/lib/authMiddleware';
import type { NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import { createProtectedHandler } from '@/lib/apiUtils';
import Withdrawals from '@/models/withdrawals';
import { transactionStatus } from '@/lib/statusUtils';
import { Users } from '@/models';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userId, wallet, amount } = req.body;
      if (!userId || !amount || !wallet) {
        return res.status(400).json({ message: 'Invalid request data' });
      }
      if (amount < 20) {
        return res
          .status(400)
          .json({ message: 'Minimum withdrawal amount is 20 USDC.' });
      }

      // @ts-ignore
      const user = await Users.findById(userId).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'User not found' });
      }

      const { balance, username } = user;

      if (balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Your balance ${balance} is less than the requested withdraw amount ${amount}`,
        });
      }

      const withdrawal = new Withdrawals({
        userId,
        amount,
        wallet,
        username,
        status: transactionStatus.pending,
      });

      await withdrawal.save({ session });

      // Update user's receiveWallet
      user.receiveWallet = wallet;
      await user.save({ session });

      await session.commitTransaction();

      return res.status(201).json({
        message: 'Withdrawal request created and receive wallet updated',
        withdrawal: withdrawal.toObject(),
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error processing withdrawal request:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await session.endSession();
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}

export default createProtectedHandler(handler);
