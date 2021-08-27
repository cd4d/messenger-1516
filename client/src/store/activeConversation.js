const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (conversation) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: {
      conversation,
    },
  };
};

const reducer = (
  state = { convoId: null, otherUserId: null, otherUserName: null },
  action
) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return {
        convoId: action.payload.conversation.id,
        otherUserId: action.payload.conversation.otherUser.id,
        otherUsername: action.payload.conversation.otherUser.name,
      };
    }
    default:
      return state;
  }
};

export default reducer;
