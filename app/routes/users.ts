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
    const user: UserInterface = (await User.findOne({
      where: { id: req.params.id },
      include: [Role],
    })) as UserInterface;
    res.json(UserOut.toUserOut(user));
  } catch (e) {
    next(e);
  }
});

users.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  // admin can patch all data
  // user can patch his data
  if (
    res.locals.jwtPayload.userId !== parseInt(req.params.id, 10) &&
    res.locals.jwtPayload.role !== 'admin'
  ) {
    res.sendStatus(403);
    return;
  }

  try {
    const userToUpdate: User = (await User.findOne({
      where: { id: req.params.id },
      include: [Role],
    })) as User;

    const user = req.body.user;
    if (user.email) {
      userToUpdate.email = user.email;
    }
    if (user.password) {
      userToUpdate.password = user.password;
    }
    if (user.name) {
      userToUpdate.name = user.name;
    }
    if (user.telephone) {
      userToUpdate.telephone = user.telephone;
    }
    if (user.emailVerified) {
      userToUpdate.emailVerified = user.emailVerified;
    }
    if (user.accountValidated) {
      userToUpdate.accountValidated = user.accountValidated;
    }
    if (user.active) {
      userToUpdate.active = user.active;
    }
    if (user.role) {
      userToUpdate.role = user.role;
    }

    const userUpdated: UserInterface = (await user.save()) as UserInterface;

    res.json(UserOut.toUserOut(userUpdated));
  } catch (e) {
    next(e);
  }
});

export default users;
