//---User Service---//

import { createHmac, randomBytes } from 'node:crypto';
import { prismaClient } from '../lib/db';
import JWT from 'jsonwebtoken';

export interface signUpTypes {
  email: string;
  name: string;
  password: string;
  isManager: boolean;
}

export interface UserTokenPayload {
  email: string;
  password: string;
}

const JWT_SECRET = String(process.env.JWT_Secre);

const generateHash = (salt: string, password: string) => {
  const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  return hashedPassword;
};

// User Signup
export const signUpUser = async (payload: signUpTypes) => {
  const { email, name, password, isManager } = payload;

  const salt = randomBytes(32).toString('hex');
  const hashedPassword = generateHash(salt, password);

  return prismaClient.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      isManager,
      salt,
    },
  });
};

//Gnerating JWT Token for User
export const generateUserToken = async (payload: UserTokenPayload) => {
  const { email, password } = payload;
  const user = await getUserByEmail(email);

  if (!user) throw new Error('User not found');

  const userSalt = user.salt;
  const hashedPassword = generateHash(userSalt, password);

  if (hashedPassword !== user.password) throw new Error('Invalid Password');

  // Generating Token
  const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '10s',
  });

  return token;
};

export const decodeJWTToken = (token: string) => {
  return JWT.verify(token, JWT_SECRET);
};

export const getUserByEmail = (email: string) => {
  return prismaClient.user.findUnique({
    where: { email },
  });
};

export const gertUserById = (id: string) => {
  return prismaClient.user.findUnique({
    where: { id },
  });
};
