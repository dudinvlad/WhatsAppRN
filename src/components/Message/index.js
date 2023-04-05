import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { getUser } from "../../graphql/queries";
dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const [isMe, setIsMe] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(message.userID === authUser.attributes.sub);
    };

    isMyMessage();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#DCF8C5" : "#FFF",
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  time: {
    color: "gray",
    alignSelf: "flex-end",
  },
});

export default Message;
