import { NextFunction, Request, Response, Router } from 'express';
import UserOut from '../mapper/user-mapper';
import Role from '../models/db/role';
import User from '../models/db/user';
import { UserInterface } from '../models/domain/user';

const users = Router();

users.get('/', async (_, res: Response, next: NextFunction) => {
  if (res.locals.jwtPayload.role !== 'admin') {
    res.sendStatus(403);
    return;
  }

  try {
    res.json(
      ((await User.findAll({ include: [Role] })) as UserInterface[]).map(
        (user: UserInterface) => UserOut.toUserOut(user as UserInterface),
      ),
    );
  } catch (e) {
    next(e);
  }
});

users.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  // admin can access all data
  // user can access his data
  if (
    res.locals.jwtPayload.userId !== parseInt(req.params.id, 10) &&
    res.locals.jwtPayload.role !== 'admin'
  ) {
    res.sendStatus(403);
    return;
  }

  try {
    // const user = await User.findByPk(req.params["id"]);
    const user: UserInterface = (await User.findOne({
      where: { id: req.params.id },
      include: [Role],
    })) as UserInterface;
    res.json(UserOut.toUserOut(user));
  } catch (e) {
    next(e);
  }
});

export default users;
