import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { FlatList } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

const NewGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState();
  const [selectedUsersIds, setSelectedUsersIds] = useState([]);

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

  const onCreateGroupPress = async () => {
    const authUser = await Auth.currentAuthenticatedUser();

    // create a new chat room
    const newChatRoomResponse = await API.graphql(
      graphqlOperation(createChatRoom, { input: { name } })
    );
    //check if the new chat doesnt exist already
    if (!newChatRoomResponse.data?.createChatRoom) {
      console.warn("Fail to create new chat!");
    }

    const newChatRoom = newChatRoomResponse.data?.createChatRoom;

    //add selected users to the new chat

    await Promise.all(
      selectedUsersIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: newChatRoom.id, userId },
          })
        )
      )
    );

    //add auth user(current) to the new chat
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    //navigate to the chat
    navigation.navigate("Chat", { id: newChatRoom.id, name });
    setSelectedUsersIds([]);
    setName(null);
  };

  const onContactPress = (userId) => {
    setSelectedUsersIds((userIds) => {
      if (userIds.includes(userId)) {
        //remove id from selected
        return [...userIds].filter((uid) => uid !== userId);
      } else {
        //add id to selected
        return [...userIds, userId];
      }
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create"
          disabled={!name || selectedUsersIds.length < 1}
          onPress={onCreateGroupPress}
        />
      ),
    });
  }, [name, selectedUsersIds]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Group name"
        value={name}
        onChangeText={setName}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            selectable
            onPress={() => onContactPress(item.id)}
            isSelected={selectedUsersIds.includes(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
});

export default NewGroupScreen;
