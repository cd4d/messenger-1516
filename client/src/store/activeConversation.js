import moment from "moment";

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (otherUserId, otherUserName) => {
  const now = moment()
  return {
    type: SET_ACTIVE_CHAT,
    payload: {
      otherUserId:otherUserId,
      otherUsername: otherUserName,
      lastActive: now._d,
    },
  };
};

const reducer = (
  state = { otherUserId: null, otherUserName: null, lastActive: null },
  action
) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return {
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
