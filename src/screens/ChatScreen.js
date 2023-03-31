import { ImageBackground, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { Text, View } from "react-native"
import bg from "../../assets/images/BG.png"
import messages from "../../assets/data/messages.json";
import Message from "../components/Message";

const ChatScreen = () => {
    return(
        <ImageBackground source={bg} style={styles.bg}>
            <FlatList
                data={messages}
                renderItem ={({ item }) => <Message message={item}/>}
                inverted
            />
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
});

export default ChatScreen;