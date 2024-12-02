/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TABLE IF NOT EXISTS academicGroups (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) UNIQUE NOT NULL,
        year TINYINT DEFAULT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS users;');
  },
};
