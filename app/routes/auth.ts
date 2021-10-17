import * as bcrypt from 'bcrypt';
import addDays from 'date-fns/addDays';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';
import { createToken } from '../lib/token';
import authMiddleware from '../middleware/auth';
import RefreshTokens from '../models/db/refreshTokens';
import Role from '../models/db/role';
import User from '../models/db/user';
import { TokenInterface } from '../models/domain/token';
import { UserInterface } from '../models/domain/user';

dotenv.config();

const refreshTokenExpiration: number = process.env
  .APP_REFRESH_TOKEN_EXP_DAYS as unknown as number;

const auth = Router();

auth.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, telephone } = req.body as UserInterface;

      // check email non already exist
      const existingUser: User | null = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ message: 'email already exists' });
        return;
      }

      // get user roleId
      const userRole: Role = (await Role.findOne({
        where: { role: 'user' },
      })) as Role;

      // create user
      const user: User = await User.create(
        {
          email,
          password: await bcrypt.hash(password, 10),
          name,
          telephone,
          roleId: userRole.id,
        },
        {
          include: [Role],
        },
      );

      // create token
      const token: TokenInterface = createToken(user.id);

      const refreshTokenExpiredAt: Date = new Date();
      refreshTokenExpiredAt.setSeconds(
        refreshTokenExpiredAt.getSeconds() + refreshTokenExpiration,
      );

      // save refreshtoken
      RefreshTokens.create({
        userId: user.id,
        token: token.refreshToken,
        expiredAt: refreshTokenExpiredAt,
      });

      // return token
      res.status(201).json(token);
    } catch (e) {
      next(e);
    }
  },
);

auth.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as UserInterface;

    const foundUser: UserInterface | null = (await User.findOne({
      where: { email },
    })) as UserInterface;
    if (
      foundUser &&
      foundUser.password &&
      (await bcrypt.compare(password, foundUser.password))
    ) {
      // delete other refreshToken
      RefreshTokens.destroy({
        where: { userId: foundUser.id },
      });

      const token: TokenInterface = createToken(foundUser.id!);

      const refreshTokenExpiredAt: Date = addDays(
        new Date(),
        refreshTokenExpiration,
      );

      RefreshTokens.create({
        userId: foundUser.id,
        token: token.refreshToken,
        expiredAt: refreshTokenExpiredAt,
      });

      res.json(token);
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    next(e);
  }
});

auth.post('/logout', authMiddleware, (_, res: Response, next: NextFunction) => {
  try {
    RefreshTokens.destroy({
      where: { userId: res.locals.jwtPayload.userId },
    });

    res.json();
  } catch (e) {
    next(e);
  }
});

export default auth;
