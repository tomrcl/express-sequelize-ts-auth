import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import RefreshTokens from '../app/models/db/refreshTokens';
import Role from '../app/models/db/role';
import User from '../app/models/db/user';

dotenv.config();

const dbName: string = process.env.DB_NAME as string;
const dbUser: string = process.env.DB_USER as string;
const dbHost: string = process.env.DB_HOST as string;
const dbPort: number = process.env.DB_PORT as unknown as number;
const dbDriver: Dialect = process.env.DB_DRIVER as Dialect;
const dbPassword: string = process.env.DB_PASSWORD as string;

const sequelize = new Sequelize({
  database: dbName,
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
  dialect: dbDriver,
  models: [RefreshTokens, User, Role],
});

export default sequelize;
