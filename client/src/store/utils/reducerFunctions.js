import { MARK_CONVO_AS_READ } from "../conversations";
import { MARK_RECIPIENT_CONVO_AS_READ } from "../conversations";

export const addMessageToStore = (state, payload) => {
  const { message, sender, conversation } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text,
    };
    if (conversation) {
      newConvo.user1Id = conversation.user1Id;
      newConvo.user2Id = conversation.user2Id;
      newConvo.userOneUnreadCount = conversation.userOneUnreadCount;
      newConvo.userTwoUnreadCount = conversation.userTwoUnreadCount;
    }
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [...convoCopy.messages, message];
      convoCopy.latestMessageText = message.text;
      if (conversation) {
        convoCopy.user1Id = conversation.user1Id;
        convoCopy.user2Id = conversation.user2Id;
        convoCopy.userOneUnreadCount = conversation.userOneUnreadCount;
        convoCopy.userTwoUnreadCount = conversation.userTwoUnreadCount;
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, payload) => {
  const { recipientId, message, conversation } = payload;
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convoCopy.messages, message];
      convoCopy.latestMessageText = message.text;
      convoCopy.user1Id = conversation.user1Id;
      convoCopy.user2Id = conversation.user2Id;
      convoCopy.userOneUnreadCount = conversation.userOneUnreadCount;
      convoCopy.userTwoUnreadCount = conversation.userTwoUnreadCount;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const sortMessagesByDate = (conversations) => {
  return conversations.map((convo) => ({
    ...convo,
    messages: convo.messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ),
  }));
};

export const markAllMessagesAsRead = (state, action) => {
  const { type, conversation, currentUser } = action;
  return state.map((convo) => {
    if (convo.id === conversation.id) {
      let messagesCopy = [...convo.messages];
      if (type === MARK_CONVO_AS_READ) {
        messagesCopy = convo.messages.map((msg) =>
          msg.senderId !== currentUser.id ? { ...msg, isUnread: false } : msg
        );
      } else if (type === MARK_RECIPIENT_CONVO_AS_READ) {
        messagesCopy = convo.messages.map((msg) =>
          msg.senderId === currentUser.id ? { ...msg, isUnread: false } : msg
        );
      }

      const convoCopy = {
        ...convo,
        userOneUnreadCount: conversation.userOneUnreadCount,
        userTwoUnreadCount: conversation.userTwoUnreadCount,
        messages: messagesCopy,
      };

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const markMessageAsRead = (state, data) => {
  return state.map((convo) => {
    if (convo.id === data.message.conversationId) {
      const convoCopy = {
        ...convo,
        messages: convo.messages.map((msg) =>
          msg.id === data.message.id ? { ...msg, isUnread: false } : msg
        ),
      };
      return convoCopy;
    }
    return convo;
  });
};
