import { Request, Response, NextFunction } from "express";
import { decodeToken, verifyToken } from "../lib/token";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Get the jwt token from the head
  const token: string = req.headers.authorization as string;

  //Try to validate the token and get data
  try {
    const tokenWithoutBearer: string = token.startsWith("Bearer ")
      ? token.substring(7)
      : token;

    verifyToken(tokenWithoutBearer);

    res.locals.jwtPayload = decodeToken(tokenWithoutBearer);
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
    return;
  }

  //Call the next middleware or controller
  next();
};
