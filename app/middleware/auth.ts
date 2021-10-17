import { Request, Response, NextFunction } from 'express';
import { decodeToken, verifyToken } from '../lib/token';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the head
  const token: string = req.headers.authorization as string;

  if (!token) {
    console.log('pas de token !');
  }

  // Try to validate the token and get data
  try {
    const tokenWithoutBearer: string = token.startsWith('Bearer ')
      ? token.substring(7)
      : token;

    verifyToken(tokenWithoutBearer);

    res.locals.jwtPayload = decodeToken(tokenWithoutBearer);
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
    return;
  }

  // Call the next middleware or controller
  next();
};

export default authMiddleware;
