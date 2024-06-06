import type {QueryInterface} from "sequelize"
import { DataTypes } from "sequelize"

module.exports = {
  async up(queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'Users',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          email: {
            unique: true,
            allowNull: false,
            type: DataTypes.STRING,
          },
          password: {
            allowNull: false,
            type: DataTypes.STRING,
          },
          name: {
            allowNull: false,
            type: DataTypes.STRING,
          },
          photo: {
            allowNull: true,
            type: DataTypes.STRING,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
        },
        { transaction },
      )
      await queryInterface.addConstraint('Users', {
        fields: ['email'],
        type: 'unique',
        name: 'email_unique',
        transaction,
      })
    })
  },

  async down(queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.dropTable('Users', { transaction }),
      ])
    })
  },
}