import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import bg from "../../assets/images/BG.png"
import messages from "../../assets/data/messages.json";
import Message from "../components/Message";
import InputBox from "../components/InputBox";
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { getChatRoom } from '../graphql/queries';

const ChatScreen = () => {
    const [chatRoom, setChatRoom] = useState();

    const route = useRoute();
    const navigation = useNavigation();

    const chatRoomId = route.params.id

    useEffect(() => {
        API.graphql(
            graphqlOperation(getChatRoom, { id: chatRoomId })
        ).then((results) => setChatRoom(results.data.getChatRoom))
    }, []);

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    if (!chatRoom) {
        return <ActivityIndicator />
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 105 : 90}
            style={styles.bg}
        >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={chatRoom.Messages.items}
                    renderItem={({ item }) => <Message message={item} />}
                    inverted
                />
                <InputBox chatRoom={chatRoom} />
            </ImageBackground>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
});

export default ChatScreen;