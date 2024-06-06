import {Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {DataTypes} from "sequelize";

@Table({
  tableName: 'Users',
  timestamps: true,
})
export default class User extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  id: string

  @Column({
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  })
  email: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  password: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  name: string

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  photo?: string

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