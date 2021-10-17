import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import RefreshTokens from '../app/models/db/refreshTokens';
import Role from '../app/models/db/role';
import User from '../app/models/db/user';

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPort = Number.parseInt(process.env.DB_PORT as string, 10);
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

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
