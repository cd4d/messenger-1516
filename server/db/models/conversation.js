const { Op, DataTypes } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  userOneUnreadCount: {
    type: DataTypes.INTEGER,
    defaultValue:0,
    validate: { min: 0 },
  },
  userTwoUnreadCount: {
    type: DataTypes.INTEGER,
    defaultValue:0,
    validate: { min: 0 },
  },
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
