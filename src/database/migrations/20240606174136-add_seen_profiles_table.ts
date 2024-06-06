import {QueryInterface, DataTypes} from "sequelize"

module.exports = {
  async up (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'SeenProfiles',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          viewerId: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            onDelete: 'CASCADE',
            references: { model: 'Users', key: 'id' },
          },
          viewedId: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            onDelete: 'CASCADE',
            references: { model: 'Users', key: 'id' },
          },
          actionableType: {
            allowNull: false,
            type: DataTypes.ENUM('LIKE', 'PASS'),
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
        'SeenProfiles',
        ['viewerId', 'viewedId'],
        {
          name: 'SeenProfiles_viewerId_viewedId',
          transaction,
        },
      )
    })
  },

  async down (queryInterface: QueryInterface) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await Promise.all([
        queryInterface.dropTable('SeenProfiles', { transaction }),
      ])
    })
  }
}
