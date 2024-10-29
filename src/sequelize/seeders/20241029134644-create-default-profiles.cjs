const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('profiles', [
          {
              id: uuidv4(),
              name: 'UserComum',
              description: 'Perfil padrão de usuário comum',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              id: uuidv4(), 
              name: 'Admin',
              description: 'Perfil de administrador do sistema',
              createdAt: new Date(),
              updatedAt: new Date()
          }
      ], {});
  },

  

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('profiles', {
          name: ['UserComum', 'Admin']
      }, {});
  }
};
