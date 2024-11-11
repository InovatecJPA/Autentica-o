'use strict';

const { all } = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('create-external-authentications', {
      external_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      authentication_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      provider: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    });
    
    await queryInterface.addConstraint('create-external-authentications', {
      fields: ['external_id', 'authentication_id'],
      type: 'unique',
      name: 'unique_external_authentication'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('create-external-authentications', 'unique_external_authentication');
    await queryInterface.dropTable('create-external-authentications');
  }
};