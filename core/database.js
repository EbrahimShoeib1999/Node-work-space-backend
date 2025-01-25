const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
});

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // logging: console.log,
});

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL!"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;