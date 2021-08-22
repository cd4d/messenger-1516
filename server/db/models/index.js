const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const GroupUser = require("./groupUser");
const GroupMessage = require("./groupMessage")
// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });
GroupMessage.belongsTo(Group);
Group.hasMany(GroupMessage);

module.exports = {
  User,
  Conversation,
  Message,
  Group,
  GroupUser,
  GroupMessage
};
