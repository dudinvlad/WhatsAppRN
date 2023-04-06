import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../graphql/subscriptions";
import { FlatList } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { deleteUserChatRoom } from "../graphql/mutations";

const GroupInfoScreen = () => {
  const [chatRoom, setChatRoom] = useState();
  const route = useRoute();

  const chatRoomID = route.params.id;
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatRoomID })).then(
      (result) => {
        setChatRoom(result.data?.getChatRoom);
      }
    );

    //subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomID } } })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.log(error),
    });

    //stop subscription
    return () => subscription.unsubscribe();
  }, [chatRoom]);

  const removeUser = async (chatRoomUser) => {
    await API.graphql(
      graphqlOperation(deleteUserChatRoom, {
        input: { _version: chatRoomUser._version, id: chatRoomUser.id },
      })
    );
  };

  const onContactItemPress = (chatRoomUser) => {
    Alert.alert(
      "Remove user",
      `Are you sure you want to remove ${chatRoomUser.user?.name} ?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeUser(chatRoomUser),
        },
      ]
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  const users = chatRoom.users.items.filter((item) => !item._deleted);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom.name}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.sectionTitle}>{users.length} Participants</Text>
        <Text
          style={{ fontWeight: "bold", color: "royalblue" }}
          onPress={() => navigation.navigate("AddContacts", { chatRoom })}
        >
          Invite friends
        </Text>
      </View>
      <View style={styles.section}>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              onPress={() => onContactItemPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 20,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default GroupInfoScreen;

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      updatedAt
      name
      users {
        items {
          id
          chatRoomId
          userId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          user {
            id
            name
            status
            image
          }
        }
        nextToken
        startedAt
      }
    }
  }
`;
