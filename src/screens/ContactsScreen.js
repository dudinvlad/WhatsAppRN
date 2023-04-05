import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCommonChatRoomWithUser } from "../services/ChatRoomService";
import { createUserChatRoom, createChatRoom } from "../graphql/mutations";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);

  const navigation = useNavigation();

  const fetchUsersAndFilter = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    API.graphql(graphqlOperation(listUsers)).then((results) => {
      const filterUsers = results.data?.listUsers?.items.filter(
        (user) => user.id !== authUser.attributes.sub
      );
      setUsers(filterUsers);
    });
  };

  useEffect(() => {
    fetchUsersAndFilter();
  }, []);

  const createNewChatRoom = async (user) => {
    const authUser = await Auth.currentAuthenticatedUser();

    const existingChatRoom = await getCommonChatRoomWithUser(user.id);

    if (existingChatRoom) {
      navigation.navigate("Chat", { id: existingChatRoom.chatRoom.id, name: user.name });
      return;
    }

    // create a new chat room
    const newChatRoomResponse = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    //check if the new chat doesnt exist already
    if (!newChatRoomResponse.data?.createChatRoom) {
      console.warn("Fail to create new chat!");
    }

    const newChatRoom = newChatRoomResponse.data?.createChatRoom;
    //add selected user to the new chat
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: user.id },
      })
    );

    //add auth user(current) to the new chat

    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    //navigate to the chat
    navigation.navigate("Chat", { id: newChatRoom.id, name: user.name });
  };

  return (
    <FlatList
      style={styles.list}
      data={users}
      renderItem={({ item }) => (
        <ContactListItem onPress={() => createNewChatRoom(item)} user={item} />
      )}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => {
            navigation.navigate("NewGroup");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#FFF",
  },
});

export default ContactsScreen;
