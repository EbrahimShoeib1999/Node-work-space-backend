'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a new UUID column
    await queryInterface.addColumn('Users', 'new_id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    });

    // Optionally, you can copy the old id values or do some other operation
    // await queryInterface.sequelize.query(`
    //   UPDATE "Users" SET "new_id" = uuid_generate_v4();
    // `);

    // Drop the old 'id' column
    await queryInterface.removeColumn('Users', 'id');

    // Rename 'new_id' to 'id'
    await queryInterface.renameColumn('Users', 'new_id', 'id');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes
    await queryInterface.addColumn('Users', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });

    await queryInterface.removeColumn('Users', 'new_id');
  }
};
