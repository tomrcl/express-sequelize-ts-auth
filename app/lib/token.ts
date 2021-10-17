import * as dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenDataInterface, TokenInterface } from '../models/domain/token';

dotenv.config();

const accessTokenSecret: string = process.env.APP_ACCESS_TOKEN_SECRET as string;
const accessTokenExpiration: string = process.env
  .APP_ACCESS_TOKEN_EXP as string;
const refreshTokenSecret: string = process.env
  .APP_REFRESH_TOKEN_SECRET as string;

export function createToken(userId: number): TokenInterface {
  const accessToken: string = jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: accessTokenExpiration,
  });
  const refreshToken: string = jwt.sign({ userId }, refreshTokenSecret);

  return {
    accessToken,
    refreshToken,
  };
}

// export function refreshToken(userId: number): TokenInterface {
//   const accessToken: string = jwt.sign({ userId }, accessTokenSecret, {
//     expiresIn: accessTokenExpiration,
//   });
//   const refreshToken: string = jwt.sign({ userId }, refreshTokenSecret);

//   return {
//     accessToken,
//     refreshToken,
//   };
// }

export function decodeToken(token: string): JwtPayload {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (e: any) {
    throw new Error(e);
  }
}

export function verifyToken(token: string): TokenDataInterface {
  try {
    return jwt.verify(token, accessTokenSecret) as TokenDataInterface;
  } catch (e: any) {
    throw new Error(e);
  }
}
