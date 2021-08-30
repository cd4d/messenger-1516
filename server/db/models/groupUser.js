const Sequelize = require("sequelize");
const db = require("../db");


const GroupUser = db.define("groupuser", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
})

module.exports = GroupUser