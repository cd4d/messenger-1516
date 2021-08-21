const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin: {
        allowNull: false,
        type: Sequelize.INTEGER
    }
});


module.exports = Group