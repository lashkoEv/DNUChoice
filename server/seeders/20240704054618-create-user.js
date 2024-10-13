/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(
      `INSERT INTO users VALUES 
        (1,'Admin','admin@example.com','$2b$10$Cn7YKwzqh0QQpS3AG88fGenKIBjGuJouMz.BEx.bklS5Z5q6kI0KK',1,NULL,'2024-09-03 19:32:40','2024-09-03 19:54:05'),
        (2,'Teacher','teacher@example.com','$2b$10$eJ.XhTQhXwCZpbwcfXdMCO7mBINTC9oTtFR04ZxrIF8fvtHtx0eiC',2,NULL,'2024-09-03 19:38:37','2024-09-03 19:38:37'),
        (3,'Student','student@example.com','$2b$10$SaJbArA5EmNewIA1Af0bwOJxFTgL2.LkDruOoDWhPxOBOL38fNDMy',3,1,'2024-09-03 19:38:47','2024-09-03 19:38:47')`,
    );
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query('DELETE FROM users');
  },
};
