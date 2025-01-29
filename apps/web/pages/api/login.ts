import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Users from '@/models/users';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { compare } from 'bcryptjs';
import { userToObject } from '@/lib/userUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    try {
      await dbConnect();
      // @ts-ignore
      const user = await Users.findOne({ username }).lean();
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }

      // Create a JWT token
      const token = sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1d' },
      );

      // Set the token as an HTTP-only cookie
      const cookie = serialize('auth', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 86400, // 1 day
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);
      const userObject = userToObject(user);
      // Respond with success
      return res.status(200).json({
        message: 'Login successful',
        user: userObject,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error during login' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
}
