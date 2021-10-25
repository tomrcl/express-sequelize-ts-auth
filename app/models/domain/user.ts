import { RoleInterface } from './role';

export interface UserInterface {
  id: number;
  email: string;
  password: string;
  name?: string;
  telephone?: string;
  emailVerified?: boolean;
  accountValidated?: boolean;
  active?: boolean;
  facebookId?: string;
  twitterId?: string;
  googleId?: string;
  role: RoleInterface;
}

export interface UserPatchInterface {
  email?: string;
  password?: string;
  name?: string;
  telephone?: string;
  emailVerified?: boolean;
  accountValidated?: boolean;
  active?: boolean;
}

export interface UserOutInterface {
  id: number;
  email: string;
  name: string;
  telephone?: string;
  role: string;
}
