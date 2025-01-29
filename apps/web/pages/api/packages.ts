import { AuthenticatedRequest } from '@/lib/authMiddleware';
import type { NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import { createProtectedHandler } from '@/lib/apiUtils';
import Users from '@/models/users';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'POST') {
    const { userId, membership } = req.body;

    if (!userId || !membership || typeof membership.price !== 'number') {
      return res
        .status(400)
        .json({ error: 'Missing userId, membership data, or invalid price' });
    }

    try {
      // @ts-ignore
      const user = await Users.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.balance < membership.price) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      if (user.status === 'INACTIVE') {
        const commission = membership.price * 0.1;

        // @ts-ignore
        await Users.findByIdAndUpdate(
          user.referral, // ID of the referral user
          { $inc: { balance: commission } }, // Increment balance by the calculated commission
          { new: true }, // Return the updated document (optional)
        );
      }

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // Prepare the update object
      const updateObj = {
        membership: membership,
        status: 'ACTIVE',
        lastActivity: twentyFourHoursAgo,
        $inc: { balance: -membership.price },
      };

      // If firstPackagePrice is 0 or undefined, set it to membership.price
      if (user.firstPackagePrice === 0) {
        (updateObj as any).firstPackagePrice = membership.price;
      }

      // @ts-ignore
      const updatedUser = await Users.findByIdAndUpdate(userId, updateObj, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        message: 'Membership updated and balance deducted successfully',
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default createProtectedHandler(handler);
