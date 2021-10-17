import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import User from './user'; // eslint-disable-line import/no-cycle

@Table
export default class Role extends Model {
  @Default('user')
  @Column(DataType.STRING)
  role?: 'user' | 'admin';

  @HasMany(() => User)
  users?: User[];
}
