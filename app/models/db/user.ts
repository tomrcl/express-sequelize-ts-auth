import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import RefreshTokens from './refreshTokens'; // eslint-disable-line import/no-cycle
import Role from './role'; // eslint-disable-line import/no-cycle

@Table
export default class User extends Model {
  @AllowNull(false)
  @Unique(true)
  @Column(DataType.TEXT)
  email?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  password?: string;

  @Column(DataType.TEXT)
  name?: string;

  @Column(DataType.TEXT)
  telephone?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  emailVerified?: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  accountValidated?: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  active?: boolean;

  @Column(DataType.TEXT)
  googleId?: string;

  @Column(DataType.TEXT)
  facebookId?: string;

  @Column(DataType.TEXT)
  twitterId?: string;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER)
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @HasOne(() => RefreshTokens)
  refreshToken?: RefreshTokens;
}
