/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(
      `INSERT INTO academicGroups VALUES 
        (1,'ПЗ-23м-2','2024-09-03 19:32:40','2024-09-03 19:54:05')`,
    );
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query('DELETE FROM academicGroups');
  },
};
