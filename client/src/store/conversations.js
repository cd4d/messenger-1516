import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  sortMessagesByDate,
  markAllMessagesAsRead,
  markMessageAsRead,
  recipientConvoAsReadToStore
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const MARK_CONVO_AS_READ = "MARK_CONVO_AS_READ";
const MARK_MESSAGE_AS_READ = "MARK_MESSAGE_AS_READ";
// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender, conversation) => {
  return {
    type: SET_MESSAGE,
    payload: {
      message,
      sender: sender || null,
      conversation: conversation || null, // conversation with updated unread counts
    },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, message, conversation) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId,  message, conversation },
  };
};

export const markConversationAsRead = (conversation, currentUser) => {
  return {
    type: MARK_CONVO_AS_READ,
    conversation,
    currentUser,
  };
};

export const messageWasRead = (message) => {
  return {
    type: MARK_MESSAGE_AS_READ,
    message,
  };
};


// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return sortMessagesByDate(action.conversations);
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload
      );
    case MARK_CONVO_AS_READ:
      return markAllMessagesAsRead(
        state,
        action.conversation,
        action.currentUser
      );
    case MARK_MESSAGE_AS_READ:
      return markMessageAsRead(state, action.message);
    default:
      return state;
  }
};

export default reducer;
