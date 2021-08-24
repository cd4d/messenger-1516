import io from "socket.io-client";
import store from "./store";
import axios from "axios";

import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    const activeConvoId = store.getState().activeConversation.convoId;
    const currentUserId = store.getState().user.id;
    console.log("message", data.message);
    console.log("activeConvo", activeConvoId);
    console.log("currentUserId", currentUserId);
    const msgCopy = { ...data.message };

    if (!activeConvoId) {
      console.log("msg is unread");
      msgCopy.isUnread = true;
      axios.patch("/api/messages/markUnread", { msgCopy });
      //convoCopy.unreadCount++
    }
    store.dispatch(
      setNewMessage(msgCopy, data.sender, activeConvoId, currentUserId)
    );
  });
});

export default socket;
