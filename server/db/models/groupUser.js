const Sequelize = require("sequelize");
const db = require("../db");
const User = require("./user");


const GroupUser = db.define("groupuser", {
    // userId:{
    //     type: Sequelize.INTEGER,
    //     allowNull:false,
    // },
    // groupId:{
    //     type: Sequelize.INTEGER,
    //     allowNull:false,
    // }
});

module.exports = GroupUser