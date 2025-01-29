import dbConnect from '../../lib/dbConnect';
import Deposits from '../../models/deposits';
import Wallet from '../../models/wallet';
import type { NextApiResponse } from 'next';
import { AuthenticatedRequest } from '@/lib/authMiddleware';
import { createProtectedHandler } from '@/lib/apiUtils';
import { Users } from '@/models';
import mongoose from 'mongoose';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'POST') {
    const { transactionId, amount, userId } = req.body;

    if (!userId || !amount || !transactionId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deposit = new Deposits({
        userId,
        amount,
        transactionId,
        status: 'confirmed',
      });
      const savedDeposit = await deposit.save({ session });

      // @ts-ignore
      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount, 'wallet.balance': amount } },
        { new: true, session },
      );

      if (!updatedUser) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the wallet document (assuming there's only one)
      // @ts-ignore
      const wallet = await Wallet.findOne({}, {}, { session });

      if (wallet) {
        // If wallet exists, update its amount
        // @ts-ignore
        await Wallet.findByIdAndUpdate(
          wallet._id,
          { $inc: { amount } },
          { new: true, session },
        );
      } else {
        // If wallet doesn't exist, create a new one
        // @ts-ignore
        await Wallet.create([{ amount }], { session });
      }

      await session.commitTransaction();
      await session.endSession();

      return res.status(201).json({
        message: 'Deposit recorded, balance and wallet updated successfully',
        deposit: savedDeposit,
        updatedUser,
      });
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      console.error('Error handling deposit update:', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

export default createProtectedHandler(handler);
