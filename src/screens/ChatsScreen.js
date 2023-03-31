import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "react-native"
import chats from '../../assets/data/chats.json'
import ChatListItem from "../components/ChatListItem";

const ChatsScreen = () => {
    return(
        <FlatList
            style={styles.list}
            data={chats}
            renderItem ={({ item }) => <ChatListItem chat={item}/>}
        />
    )
};

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#FFF',
    },
});

export default ChatsScreen;