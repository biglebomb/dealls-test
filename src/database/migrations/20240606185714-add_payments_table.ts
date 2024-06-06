import {DataTypes, QueryInterface} from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'Payments',
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
          premiumPackageId: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            onDelete: 'CASCADE',
            references: { model: 'PremiumPackages', key: 'id' },
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
        'Payments',
        ['userId', 'premiumPackageId'],
        {
          name: 'Payments_userId_premiumPackageId',
          transaction,
        },
      )
    })
  },

  async down (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.dropTable('Payments', { transaction }),
      ])
    })
  }
};
