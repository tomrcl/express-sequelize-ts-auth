import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './user'; // eslint-disable-line import/no-cycle

@Table
export default class RefreshTokens extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  token!: string;

  @Column(DataType.DATE)
  expiredAt!: Date;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
