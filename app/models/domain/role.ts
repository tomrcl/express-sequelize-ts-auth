import { User } from '../db/user';

export interface RoleInterface {
  role: 'user' | 'admin';
  users: User[];
}
