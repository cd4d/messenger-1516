export const addMessageToStore = (state, payload) => {
  const { message, sender, userSending } = payload;
  const activeConvo = JSON.parse(window.localStorage.getItem("activeConvo"))
  const isUnreadMessage = (userSending !== message.senderId && activeConvo !== message.senderId)
  if (isUnreadMessage) {
    message.unread = true;
  }
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [...convoCopy.messages, message];
      convoCopy.latestMessageText = message.text;
      if (isUnreadMessage) {
        convoCopy.unreadCount = convo.messages.reduce(
          (count, msg) => (msg?.unread ? count + 1 : count),
          1
        );
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

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convoCopy.messages, message];
      convoCopy.latestMessageText = message.text;
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

export const markAllMessagesAsRead = (state, otherUserId) => {
  return state.map((convo) => {
    if (convo.otherUser.id === otherUserId) {
      const convoCopy = { ...convo };
      convoCopy.messages = convoCopy.messages.map((msg) => ({
        ...msg,
        unread: false,
      }));
      convoCopy.unreadCount = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};


