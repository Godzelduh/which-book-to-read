// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = (token: string) => {
  if (!token) {
    throw new Error('No token provided');
  }

  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export default new AuthService();
