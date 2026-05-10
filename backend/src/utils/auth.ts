import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const options: any = {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  };
  return jwt.sign({ userId }, secret, options as any);
};
