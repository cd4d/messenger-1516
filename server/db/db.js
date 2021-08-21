require("dotenv").config();
const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABSE_TEST_URL || process.env.DATABASE_LOCAL_TEST,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    logging: false,
    dialect: "postgres",
  }
);

module.exports = db;
