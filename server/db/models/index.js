const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const GroupUser = require("./groupUser");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation, { as: "conversation" });
Conversation.hasMany(Message);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });
Message.belongsTo(Group, { as: "group" });
Group.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  Group,
  GroupUser
};
