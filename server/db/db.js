require("dotenv").config()
const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/messenger",
  "admin_messenger",
  process.env.DB_PASSWORD,
  {
    logging: false,
    dialect: "postgres"
  }
);

module.exports = db;
