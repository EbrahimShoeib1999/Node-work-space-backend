const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log({
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
});

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

// // Import models after the sequelize instance
// const Supplier = require('../features/supplier/models/supplier');
// const Inventory = require('../features/inventory/models/inventory');

//
// sequelize.sync({ alter: true }).then(() => {
//     console.log('Database and models synced!');
// }).catch(err => {
//     console.error('Error syncing the database:', err);
// });-

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgresSQL'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
