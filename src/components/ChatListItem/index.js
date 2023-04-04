import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import { onUpdateChatRoom } from "../../graphql/subscriptions";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
  const navigation = useNavigation();
  const [opponent, setOpponent] = useState();
  const [chatRoom, setChatRoom] = useState(chat);

  useEffect(() => {
    const getOpponentUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const opponentUser = chatRoom.users.items.find(
        (item) => item.user.id !== authUser.attributes.sub
      ).user;
      setOpponent(opponentUser);
    };
    getOpponentUser();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chat.id } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.log(error),
    });

    return () => subscription.unsubscribe();
  }, [chat.id]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", { id: chatRoom.id, name: opponent?.name })
      }
      style={styles.container}
    >
      <Image style={styles.avatar} source={{ uri: opponent?.image }} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {opponent?.name}
          </Text>
          {chatRoom.LastMessage && (
            <Text style={styles.subTitle}>
              {dayjs(chatRoom.LastMessage?.createdAt).fromNow(true)}
            </Text>
          )}
        </View>
        <Text numberOfLines={2} style={styles.subTitle}>
          {chatRoom.LastMessage?.text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
  },
});

export default ChatListItem;
