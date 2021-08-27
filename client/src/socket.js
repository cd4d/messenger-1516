import io from "socket.io-client";
import store from "./store";
import axios from "axios";

import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  messageWasRead,
  markRecipientConversationAsRead,
} from "./store/conversations";
import { sendReadUpdate } from "./store/utils/thunkCreators";
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

    if (activeConvoId !== data.message.conversationId) {
      store.dispatch(
        setNewMessage(data.message, data.sender, data.conversation)
      );
      return;
    } else {
      axios
        .patch("/api/messages/markRead", data.message)
        .then((res) => {
          store.dispatch(
            setNewMessage(
              res.data.readMessage[1][0],
              data.sender,
              res.data
                ? res.data.updatedConvo[0][0][0]
                : JSON.parse(res.config.data)
            )
          );
          sendReadUpdate(res.data.readMessage[1][0]);
        })
        // .finally(sendReadUpdate(res.data.readMessage[1][0]))
        .catch((error) => {
          console.error(error);
        });
    }
  });
  socket.on("message-was-read", (message) => {
    store.dispatch(messageWasRead(message));
  });

  socket.on("recipient-has-read-all", (data) => {
    const currentUser = store.getState().user;
    const conversation = data.conversation;
    store.dispatch(markRecipientConversationAsRead(conversation, currentUser));
  });
});

export default socket;
