/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(
      `INSERT INTO academicGroups VALUES 
        (1,'ПЗ-24-1',1,'2024-09-03 19:32:40','2024-09-03 19:54:05'),
        (2,'ПЗ-23-1',2,'2024-09-03 19:32:40','2024-09-03 19:54:05'),
        (3,'ПЗ-22-1',3,'2024-09-03 19:32:40','2024-09-03 19:54:05'),
        (4,'ПЗ-21-1',4,'2024-09-03 19:32:40','2024-09-03 19:54:05'),
        (5,'ПЗ-24м-1',5,'2024-09-03 19:32:40','2024-09-03 19:54:05'),
        (6,'ПЗ-23м-1',6,'2024-09-03 19:32:40','2024-09-03 19:54:05');`,
    );
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query('DELETE FROM academicGroups');
  },
};
