import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import type {QueryInterface} from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    try {
      const userData = [];
      for (let i = 1; i <= 20; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10)
        userData.push({
          id: uuid.v4(),
          email: `user${i}@example.com`,
          password: hashedPassword,
          name: `User ${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await queryInterface.bulkInsert('Users', userData, {});

      console.log('Users seeded successfully');
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
