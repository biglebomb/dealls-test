import {DataTypes, QueryInterface} from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'PremiumPackages',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          name: {
            allowNull: false,
            type: DataTypes.STRING,
          },
          price: {
            allowNull: false,
            type: DataTypes.INTEGER,
          }
        }
      )

      await queryInterface.addIndex(
        'PremiumPackages',
        ['name'],
        {
          name: 'PremiumPackages_name',
          transaction,
        },
      )
    })
  },

  async down (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.dropTable('PremiumPackages', { transaction }),
      ])
    })
  }
};
