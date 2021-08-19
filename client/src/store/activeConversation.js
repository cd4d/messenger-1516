import moment from "moment";

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (id, username) => {
  const now = moment()
  return {
    type: SET_ACTIVE_CHAT,
    payload: {
      convoWithId: id,
      convoWithName: username,
      lastActive: now._d,
    },
  };
};

const reducer = (
  state = { convoWithId: null, convoWithName: null, lastActive: null },
  action
) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return {
        convoWithId: action.payload.convoWithId,
        convoWithName: action.payload.convoWithName,
        lastActive: action.payload.lastActive,
      };
    }
    default:
      return state;
  }
};

export default reducer;
