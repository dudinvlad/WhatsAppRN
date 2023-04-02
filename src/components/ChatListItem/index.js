import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text } from "react-native"
import { useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Auth } from 'aws-amplify';
import { useEffect, useState } from "react";
dayjs.extend(relativeTime);

const ChatListItem = ({ chat }) => {
    const navigation = useNavigation();
    const [opponent, setOpponent] = useState();

    useEffect(() => {
        const getOpponentUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const opponentUser = chat.users.items.find(item => item.user.id !== authUser.attributes.sub).user;
            setOpponent(opponentUser);
        }
        getOpponentUser();
    }, []);

    return (
        <Pressable onPress={() => navigation.navigate('Chat', { id: chat.id, name: opponent?.name })} style={styles.container}>
            <Image
                style={styles.avatar}
                source={{ uri: opponent?.image }}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{opponent?.name}</Text>
                    <Text style={styles.subTitle}>{dayjs(chat.lastMessage?.createdAt).fromNow(true)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.subTitle}>
                    {chat.LastMessage?.text}
                </Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    content: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgray',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    },
    subTitle: {
        color: 'gray',
    },
});

export default ChatListItem;