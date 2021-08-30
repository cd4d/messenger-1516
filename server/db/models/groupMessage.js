const Sequelize = require("sequelize");
const db = require("../db");

const GroupMessage = db.define("groupmessage", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = GroupMessage;