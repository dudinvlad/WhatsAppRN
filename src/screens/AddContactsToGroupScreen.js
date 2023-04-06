import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { FlatList } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

const AddContactsToGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsersIds, setSelectedUsersIds] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const fetchUsersAndFilter = async () => {
    const authUser = await Auth.currentAuthenticatedUser();
    API.graphql(
      graphqlOperation(listUsers, {
        filter: { id: { notContains: authUser.attributes.sub } },
      })
    ).then((results) => {
      const existingChatMembers = route.params.chatRoom.users.items.filter(
        (item) => !item._deleted
      );
      // console.log(existingChatMembers);
      const allUsers = results.data?.listUsers?.items;
      const filterUsers = allUsers.filter(
        (cUser) =>
          !existingChatMembers.some((eChatUser) => cUser.id === eChatUser.userId)
      );
      // console.log("CURRENT USERS", JSON.stringify(existingChatMembers, null, 2));
      // console.log("ALL USERs", JSON.stringify(allUsers, null, 2));
      setUsers(filterUsers);
    });
  };

  useEffect(() => {
    fetchUsersAndFilter();
  }, []);

  const onAddToGroupPress = async () => {
    //add selected users to the new chat
    await Promise.all(
      selectedUsersIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: route.params.chatRoom.id, userId },
          })
        )
      )
    );

    //navigate to the chat
    navigation.goBack();
    setSelectedUsersIds([]);
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
          title="Invite"
          disabled={selectedUsersIds.length < 1}
          onPress={onAddToGroupPress}
        />
      ),
    });
  }, [selectedUsersIds]);

  return (
    <View style={styles.container}>
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

export default AddContactsToGroupScreen;
