import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { FlatList } from "react-native";
import bg from "../../assets/images/BG.png";
import Message from "../components/Message";
import InputBox from "../components/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";
import { onCreateMessage, onUpdateChatRoom } from "../graphql/subscriptions";
import GroupInfoButton from "../components/GroupInfoButton";

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState();
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();

  const chatRoomId = route.params.id;

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomId })).then(
      (results) => {
        setChatRoom(results.data.getChatRoom);
      }
    );

    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomId } } })
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
  }, [chatRoomId]);

  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID: chatRoomId,
        sortDirection: "DESC",
      })
    ).then((results) => {
      setMessages(results.data.listMessagesByChatRoom.items);
    });

    //subsribe to new messages

    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatRoomId } },
      })
    ).subscribe({
      next: ({ value }) => {
        setMessages((currentMessages) => [
          value.data.onCreateMessage,
          ...currentMessages,
        ]);
      },
      error: (error) => console.log(error),
    });

    //stop the subsription

    return () => subscription.unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerRight: () => (
        <GroupInfoButton
          name="info"
          size={24}
          color="lightgray"
          onPress={() => navigation.navigate("GroupInfo", { id: chatRoomId })}
        />
      ),
    });
  }, [route.params.name, chatRoomId]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 105 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          inverted
        />
        <InputBox chatRoom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});

export default ChatScreen;
