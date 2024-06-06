import {AllowNull, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";
import PremiumPackage from "database/models/PremiumPackage";
import User from "database/models/User";

export enum PaymentMethods {
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
}

@Table({
  tableName: 'Payments',
  timestamps: true,
})
export default class Payment extends Model {

  @PrimaryKey
  @Column({
    type: DataTypes.UUID
  })
  id: string


  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: string

  @ForeignKey(() => PremiumPackage)
  @AllowNull(false)
  @Column({
    type: DataTypes.UUID
  })
  premiumPackageId: PremiumPackage

  @Column({
    allowNull: false,
    type: DataTypes.ENUM(PaymentMethods.CASH, PaymentMethods.CREDIT_CARD),
  })
  paymentMethod: PaymentMethods

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