import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
  tableName: 'PremiumPackages',
  timestamps: true,
})
export default class PremiumPackage extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID
  })
  id: string

  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  name: string

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false
  })
  price: number
}