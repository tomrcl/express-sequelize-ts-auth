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
} from "sequelize-typescript";
import { RefreshTokens } from "./refreshTokens";
import { Role } from "./role";

@Table
export class User extends Model {
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
  emailValidated: boolean = false;

  @Default(false)
  @Column(DataType.BOOLEAN)
  accountValidated: boolean = false;

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
