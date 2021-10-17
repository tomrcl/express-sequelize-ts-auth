import { UserInterface, UserOutInterface } from '../models/domain/user';

export default class UserOut implements UserOutInterface {
  id: number = 0;

  email: string = '';

  name: string = '';

  telephone: string = '';

  role: string = '';

  static toUserOut(user: UserInterface): UserOut {
    return {
      id: user.id || 0,
      email: user.email,
      name: '',
      telephone: '',
      role: user.role?.role,
    };
  }
}
