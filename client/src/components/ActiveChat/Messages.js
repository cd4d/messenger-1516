import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={uuidv4()} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={uuidv4()}
            text={message.text}
            time={time}
            otherUser={otherUser}
            isUnread={message.isUnread || false}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
