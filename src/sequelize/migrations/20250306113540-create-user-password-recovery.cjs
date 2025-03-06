'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user-password-recoveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      authenticationId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "authentications",
          key: "id"
        }
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      expirationDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user-password-recoveries');
  }
};