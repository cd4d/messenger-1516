const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user");


const GroupUser = db.define("groupuser", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
})

module.exports = GroupUser