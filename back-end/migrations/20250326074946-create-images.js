module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Images", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bookId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Books",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      url: {
        type: Sequelize.STRING, // Menyimpan URL gambar
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING, // Misalnya "cover", "illustration", dll.
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Images");
  },
};
