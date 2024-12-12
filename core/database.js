const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, // Disable SQL logging
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
