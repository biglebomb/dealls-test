import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default, ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  BelongsTo
} from 'sequelize-typescript'
import { DataTypes} from "sequelize";
import User from "database/models/User";

@Table({
  tableName: 'AuthTokens',
  timestamps: true,
  indexes: [
    {
      name: 'AuthTokens_token',
      fields: ['token'],
      unique: true,
    },
  ],
})
export default class AuthToken extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string

  @AllowNull(false)
  @Column(DataType.UUID)
  token: string

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  userId: string

  @BelongsTo(() => User)
  User: User | null

  @AllowNull(false)
  @Column({
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  })
  expiredAt: Date

  @CreatedAt
  @Column({
    type: DataTypes.DATE
  })
  createdAt: Date

  @UpdatedAt
  @Column({
    type: DataTypes.DATE
  })
  updatedAt: Date
}
