import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/users';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { hash } from 'bcryptjs';
import { userToObject } from '@/lib/userUtils';
import { createSolanaWallet } from '@/utils/web3-utils'; // Import Solana Web3.js for wallet generation

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const {
      username,
      password,
      confirmPassword,
      email,
      phoneNumber,
      referral,
    } = req.body;
    if (!username || !email || password !== confirmPassword) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
      const connection = await dbConnect();

      // @ts-ignore
      const referralUser = await Users.findById(referral);
      if (!referralUser) {
        return res
          .status(400)
          .json({ message: 'Referral code does not exist.' });
      }

      const saltRounds = 10;
      const hashedPassword = await hash(password, saltRounds);

      const wallet = createSolanaWallet();

      const user = new Users({
        username,
        password: hashedPassword,
        email,
        phoneNumber,
        referral,
        balance: 0,
        lastActivity: null,
        status: 'INACTIVE',
        wallet,
        receiveWallet: '',
        joinedAt: new Date(),
      });

      const dbUser = await user.save();

      referralUser.members.push(dbUser._id);
      await referralUser.save();
      const userObject = userToObject(dbUser.toObject());
      // Create a JWT token
      const token = sign(
        { userId: userObject.id, username: userObject.username },
        JWT_SECRET,
        { expiresIn: '1d' },
      );

      const cookie = serialize('auth', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 86400, // 1 day
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);

      // Respond with success
      return res.status(200).json({
        message: 'Registration successful',
        user: userObject,
      });
    } catch (error) {
      // @ts-ignore
      const duplicateError: any = error?.errorResponse?.keyValue;
      if (duplicateError) {
        return res.status(500).json({
          message: `${JSON.stringify(duplicateError)} already exists.`,
        });
      }
      return res.status(500).json({ message: 'Error during registration' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
