import { Keyboard, StyleSheet, Text, View } from "react-native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { TextInput } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createMessage, updateChatRoom } from '../../graphql/mutations';

const InputBox = ({ chatRoom }) => {

    const [newMessage, setNewMessage] = useState('');
    const onSend = async () => {
        const authUser = await Auth.currentAuthenticatedUser();

        const message = {
            chatroomID: chatRoom.id,
            text: newMessage,
            userID: authUser.attributes.sub,
        }
        const createMessageResponse = await API.graphql(
            graphqlOperation(createMessage, { input: message })
        )
        await API.graphql(
            graphqlOperation(updateChatRoom, {
                input: {
                    id: chatRoom.id,
                    _version: chatRoom._version,
                    chatRoomLastMessageId: createMessageResponse.data.createMessage.id
                }
            })
        )
        setNewMessage(null);
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView style={styles.container}>
            <AntDesign name='plus' size={24} color='royalblue' />
            <TextInput value={newMessage} onChangeText={setNewMessage} style={styles.input} placeholder="Type your message..." />
            <MaterialIcons onPress={onSend} style={styles.send} name="send" size={24} color='#FFF' />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: 'whitesmoke',
        padding: 5,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        marginHorizontal: 15,
        marginTop: 5,
    },
    send: {
        marginRight: 5,
        backgroundColor: 'royalblue',
        padding: 5,
        borderRadius: 17,
        overflow: 'hidden',
    },
});

export default InputBox;