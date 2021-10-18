import * as bcrypt from 'bcrypt';
import addDays from 'date-fns/addDays';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';
import { sendMail } from '../lib/mailer';
import { createToken } from '../lib/token';
import authMiddleware from '../middleware/auth';
import RefreshTokens from '../models/db/refreshTokens';
import Role from '../models/db/role';
import User from '../models/db/user';
import { RoleInterface } from '../models/domain/role';
import { TokenInterface } from '../models/domain/token';
import { UserInterface } from '../models/domain/user';

dotenv.config();

const refreshTokenExpiration: number = process.env
  .APP_REFRESH_TOKEN_EXP_DAYS as unknown as number;

const auth = Router();

/**
 * calculate the expiration date of refreshToken and save it
 *
 * @param userId
 * @param token
 */
const saveRefreshToken = (userId: number, token: string): void => {
  const refreshTokenExpiredAt: Date = addDays(
    new Date(),
    refreshTokenExpiration,
  );

  RefreshTokens.create({
    userId,
    token,
    expiredAt: refreshTokenExpiredAt,
  });
};

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

      sendMail(email, name);

      // create token
      const token: TokenInterface = createToken(
        user.id,
        userRole as RoleInterface,
      );

      saveRefreshToken(user.id, token.refreshToken);

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
      include: [Role],
    })) as UserInterface;
    if (
      foundUser &&
      foundUser.password &&
      foundUser.id &&
      (await bcrypt.compare(password, foundUser.password))
    ) {
      // delete other refreshToken
      RefreshTokens.destroy({
        where: { userId: foundUser.id },
      });

      const token: TokenInterface = createToken(foundUser.id, foundUser.role);

      saveRefreshToken(foundUser.id, token.refreshToken);

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
