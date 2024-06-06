import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import User from "database/models/User";

export enum SeenProfileActionableType {
  PASS = 'PASS',
  LIKE = 'LIKE'
}

@Table({
  tableName: 'SeenProfiles',
  timestamps: true,
})
export default class SeenProfile extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  })
  id: string

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataTypes.UUID,
  })
  viewerId: string

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataTypes.UUID,
  })
  viewedId: string

  @Column({
    type: DataTypes.ENUM(SeenProfileActionableType.LIKE, SeenProfileActionableType.PASS),
    allowNull: false,
    defaultValue: SeenProfileActionableType.PASS,
  })
  actionableType: SeenProfileActionableType

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

  @BelongsTo(() => User)
  Viewer: User | null

  @BelongsTo(() => User)
  Viewed: User | null
}