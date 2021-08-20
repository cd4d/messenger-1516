import moment from "moment";

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (convoId, otherUserId, otherUserName) => {
  const now = moment();
  const activeConvo = otherUserId
  window.localStorage.setItem("activeConvo", JSON.stringify(activeConvo))
  return {
    type: SET_ACTIVE_CHAT,
    payload: {
      convoId,
      otherUserId,
      otherUserName,
      lastActive: now._d,
    },
  };
};

const reducer = (
  state = { convoId: null, otherUserId: null, otherUserName: null, lastActive: null },
  action
) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return {
        convoId: action.payload.convoId,
        otherUserId: action.payload.otherUserId,
        otherUsername: action.payload.otherUsername,
        lastActive: action.payload.lastActive,
      };
    }
    default:
      return state;
  }
};

export default reducer;
