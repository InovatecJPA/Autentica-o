module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('authentications', {
          id: {
              type: Sequelize.STRING,
              primaryKey: true
          },
          login: {
              type: Sequelize.STRING,
              unique: true
          },
          passwordHash: {
              type: Sequelize.STRING
          },
          active: {
              type: Sequelize.BOOLEAN
          },
          createdAt: {
              type: Sequelize.DATE
          },
          updatedAt: {
              type: Sequelize.DATE
          }
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('authentications');
  }
};
