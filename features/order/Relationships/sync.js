const sequelize = require("./config/database");
const { Order, OrderItem } = require("../Relationships/index");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // `force: true` will drop tables if they exist
    console.log("Database & tables created!");
  } catch (err) {
    console.error("Failed to sync database:", err);
  }
};

syncDatabase();