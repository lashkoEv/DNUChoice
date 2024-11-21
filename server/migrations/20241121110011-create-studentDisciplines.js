/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `CREATE TABLE IF NOT EXISTS studentDisciplines (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        studentId INT NOT NULL,
        disciplineId INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
        
        CONSTRAINT studentDisciplinesUsersStudentId FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT studentDisciplinesDisciplinesDisciplineId FOREIGN KEY (disciplineId) REFERENCES disciplines(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'DROP TABLE IF EXISTS studentDisciplines;',
    );
  },
};
