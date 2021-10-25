import { UserInterface } from './user';

export interface RoleInterface {
  role: 'user' | 'admin';
  users: UserInterface[];
}
