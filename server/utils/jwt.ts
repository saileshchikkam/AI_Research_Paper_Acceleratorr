import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'researchmind_super_secret_key_12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
