import { FlatList, StyleSheet } from "react-native";
import chats from "../../../assets/data/chats.json";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";

const ChatsScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatRooms = async () => {
    setIsLoading(true);
    const authUser = await Auth.currentAuthenticatedUser();
    const response = await API.graphql(
      graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    );
    const rooms = response?.data?.getUser?.ChatRooms?.items || [];
    const sortedRooms = rooms.sort(
      (room1, room2) =>
        new Date(room2.chatRoom.updatedAt) - new Date(room1.chatRoom.updatedAt)
    );
    const activeRooms = sortedRooms.sort(
      (item1, item2) =>
        new Date(item2.chatRoom?.LastMessage?.createdAt) -
        new Date(item1.chatRoom?.LastMessage?.createdAt)
    );
    setChatRooms(activeRooms);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={chatRooms}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
      refreshing={isLoading}
      onRefresh={fetchChatRooms}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#FFF",
  },
});

export default ChatsScreen;
