require("dotenv").config();
const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL || process.env.DATABASE_LOCAL,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    logging: false,
    dialect: "postgres",
  }
);

module.exports = db;
