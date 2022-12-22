'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("rooms","UserId")
  },

  async down (queryInterface, Sequelize) {
  }
};
