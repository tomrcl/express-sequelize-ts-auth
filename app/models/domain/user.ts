import { RoleInterface } from "./role";

export interface UserInterface {
  id?: number;
  email: string;
  password: string;
  name?: string;
  telephone?: string;
  emailValidated?: boolean;
  accountValidated?: boolean;
  facebookId?: string;
  twitterId?: string;
  googleId?: string;
  role: RoleInterface;
}

export interface UserOutInterface {
  id: number;
  email: string;
  name: string;
  telephone?: string;
  role: string;
}
