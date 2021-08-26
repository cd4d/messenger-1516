import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  markConversationAsRead,
} from "../conversations";
import { setActiveChat } from "../activeConversation";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  console.log("savemsg data", data);
  return data;
};

const sendMessage = (data, body) => {
  console.log("sendmsg data", data);
  console.log("sendmsg body", body);
  const conversation = data.newConversation
      ? data.newConversation
      : data.updatedConversation[0][0][0];
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
    conversation: conversation,
  });
};

export const sendReadUpdate = (message) => {
  console.log("emit read update");
  socket.emit("message-read", message);
};

const sendReadConvo = (conversation) => {
  socket.emit("conversation-read", conversation);
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if it's a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);
    console.log("postmsg data", data);
    const conversation = data.newConversation
      ? data.newConversation
      : data.updatedConversation[0][0][0];
    if (data) {
      if (!body.conversationId) {
        dispatch(addConversation(body.recipientId, data.message, conversation));
      } else {
        dispatch(setNewMessage(data.message, data.sender, conversation));
      }
      sendMessage(data, body);
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const activeChatThunk = (
  convoId,
  otherUserId,
  otherUserName,
  currentUser
) => async (dispatch) => {
  if (convoId) {
    const { data } = await axios.patch("api/conversations/markConvoAsRead", {
      convoId,
    });
    if (data && data.updatedConversation) {
      const conversation = data.updatedConversation[1];
      dispatch(markConversationAsRead(conversation, currentUser));

      sendReadConvo(conversation);
    }
  }
  dispatch(setActiveChat(convoId, otherUserId, otherUserName));
};
