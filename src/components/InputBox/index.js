import { Keyboard, StyleSheet, Text, View } from "react-native";
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import { TextInput } from "react-native";
import { useState } from "react";

const InputBox = () => {

    const [newMessage, setNewMessage] = useState('');

    const onSend = () => {
        console.warn('Sending a new message: ', newMessage);
        setNewMessage(null);
        Keyboard.dismiss();
    }

    return(
        <View style={styles.container}>
            <AntDesign name='plus' size={24} color='royalblue'/>
            <TextInput value={newMessage} onChangeText={setNewMessage} style={styles.input} placeholder="type your message here..."/>
            <MaterialIcons onPress={onSend} style={styles.send} name="send" size={24} color='#FFF'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: 'whitesmoke',
        padding: 5,
    },
    input:{
        flex: 1,
        backgroundColor: '#FFF',
        padding: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    send:{
        marginRight: 5,
        backgroundColor: 'royalblue',
        padding: 5,
        borderRadius: 17,
        overflow: 'hidden',
    },
});

export default InputBox;