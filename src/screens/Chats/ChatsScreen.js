import { FlatList, StyleSheet } from "react-native";
import chats from "../../../assets/data/chats.json";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";

const ChatsScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
      );
      const rooms = response?.data?.getUser?.ChatRooms?.items || [];
      const sortedRooms = rooms.sort(
        (room1, room2) =>
          new Date(room2.chatRoom.updatedAt) - new Date(room1.chatRoom.updatedAt)
      );
      setChatRooms(sortedRooms);
    };

    fetchChatRooms();
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#FFF",
  },
});

export default ChatsScreen;
