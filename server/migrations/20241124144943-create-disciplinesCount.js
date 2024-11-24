/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TABLE IF NOT EXISTS disciplinesCount (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        groupId INT DEFAULT NULL,
        disciplinesCount INT NOT NULL,
        toSemester TINYINT NOT NULL,
        toYear TINYINT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT disciplinesCountAcademicGroupsGroupId FOREIGN KEY (groupId) REFERENCES academicGroups(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS users;');
  },
};
