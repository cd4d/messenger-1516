const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    // if (conversationId) {
    //   const message = await Message.create({ senderId, text, conversationId });
    //   return res.json({ message, sender });
    // }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let targetConversation = await Conversation.findConversation(
      senderId,
      recipientId
    );
    if (targetConversation) {
      let updatedConversation = {};
      const message = await Message.create({ senderId, text, conversationId });
      // increment unread counts

      if (recipientId === targetConversation.dataValues.user1Id) {
        updatedConversation = await Conversation.increment(
          { userOneUnreadCount: 1 },
          {
            where: { id: conversationId },
          }
        );
      } else if (recipientId === targetConversation.dataValues.user2Id) {
        updatedConversation = await Conversation.increment(
          { userTwoUnreadCount: 1 },
          {
            where: { id: conversationId },
          }
        );
      }
      return res.json({ message, sender, updatedConversation });
    } else {
      // create conversation
      const newConversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
        userTwoUnreadCount: 1,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
      const message = await Message.create({
        senderId,
        text,
        conversationId: newConversation.id,
      });

      res.json({ message, sender, newConversation });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/markRead", async (req, res, next) => {
  try {
    let updatedConvo;
    const conversation = await Conversation.findOne({
      where: { id: req.body.conversationId },
    });
    const readMessage = await Message.update(
      { isUnread: false },
      {
        where: { id: req.body.id },
        returning:true
      }
    );
    const receiverId =
      conversation.dataValues.user1Id !== req.body.senderId
        ? conversation.dataValues.user1Id
        : conversation.dataValues.user2Id;

    if (receiverId === conversation.dataValues.user1Id && conversation.dataValues.userOneUnreadCount > 0) {
      updatedConvo = await Conversation.decrement(
        { userOneUnreadCount: 1 },
        {
          where: { id: req.body.conversationId },
        }
      );
    } else if (receiverId === conversation.dataValues.user2Id && conversation.dataValues.userTwoUnreadCount > 0) {
      updatedConvo = await Conversation.decrement(
        { userTwoUnreadCount: 1 },
        {
          where: { id: req.body.conversationId },
        }
      );
    }
    res.json({updatedConvo, readMessage});
  } catch (error) {
    next(error);
  }
});
module.exports = router;
