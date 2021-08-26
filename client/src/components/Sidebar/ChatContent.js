import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    fontSize: 12,
    letterSpacing: -0.17,
    fontWeight: "bolder",
    color: "black",
  },
  unreadCount: {
    margin: 20,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, user } = props;
  const {
    latestMessageText,
    otherUser,
    userOneUnreadCount,
    userTwoUnreadCount,
    user1Id,
    user2Id
  } = conversation;
  let unreadCount = null;
  if (user.id === user1Id) {
    unreadCount = userOneUnreadCount;
  } else if (user.id === user2Id) {
    unreadCount = userTwoUnreadCount;
  }
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            unreadCount ? classes.previewTextUnread : classes.previewText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      <Badge
        badgeContent={unreadCount}
        color="primary"
        className={classes.unreadCount}
      ></Badge>
    </Box>
  );
};

export default ChatContent;
