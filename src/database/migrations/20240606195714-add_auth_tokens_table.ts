import {DataTypes, QueryInterface} from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'AuthTokens',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          userId: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            onDelete: 'CASCADE',
            references: { model: 'Users', key: 'id' },
          },
          token: {
            allowNull: false,
            type: DataTypes.STRING,
            defaultValue: DataTypes.STRING,
          },
          expiredAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
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
        }
      )

      await queryInterface.addIndex(
        'AuthTokens',
        ['userId', 'token'],
        {
          name: 'AuthTokens_userId_token',
          transaction,
        },
      )
    })
  },

  async down (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.dropTable('AuthTokens', { transaction }),
      ])
    })
  }
};
