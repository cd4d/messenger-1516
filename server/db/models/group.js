const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    adminId: {
        allowNull: false,
        type: Sequelize.INTEGER
    }
});

Group.findGroup = async function (groupId) {
    const group = await Group.findByPk(groupId)
    return group

}

module.exports = Group