import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Message = ({ message }) => {

    const isMyMessage = () => {
        return message.user.id === 'u1';
    }

    return(
        <View style={[
            styles.container,
            {
                backgroundColor: isMyMessage() ? '#DCF8C5' : '#FFF',
                alignSelf: isMyMessage() ? 'flex-end' : 'flex-start',
            }]}>
            <Text>{message.text}</Text>
            <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        margin: 5,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
        maxWidth: '80%'
    },
    time: {
        color: 'gray',
        alignSelf: 'flex-end',
    },
});

export default Message;