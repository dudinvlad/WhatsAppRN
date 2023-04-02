import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text } from "react-native"
import { useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations';
import { getCommonChatRoomWithUser } from '../../services/ChatRoomService';

const ContactListItem = ({ user }) => {
    const navigation = useNavigation();

    const onPress = async () => {

        const authUser = await Auth.currentAuthenticatedUser();

        const existingChatRoom = await getCommonChatRoomWithUser(user.id)

        if (existingChatRoom) {
            navigation.navigate('Chat', { id: existingChatRoom.id, name: user.name })
            return;
        }

        // create a new chat room
        const newChatRoomResponse = await API.graphql(
            graphqlOperation(createChatRoom, { input: {} })
        )
        //check if the new chat doesnt exist already 
        if (!newChatRoomResponse.data?.createChatRoom) {
            console.warn('Fail to create new chat!');
        }

        const newChatRoom = newChatRoomResponse.data?.createChatRoom;
        //add selected user to the new chat
        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomId: newChatRoom.id, userId: user.id }
            })
        )

        //add auth user(current) to the new chat

        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub }
            })
        )

        //navigate to the chat
        navigation.navigate('Chat', { id: newChatRoom.id, name: user.name })
    }

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image
                style={styles.avatar}
                source={{ uri: user.image }}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
                    <Text style={styles.subTitle} numberOfLines={2}>{user.status}</Text>
                </View>
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
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    },
    subTitle: {
        color: 'gray',
        flexWrap: 'wrap',
        paddingTop: 5,
    }
});

export default ContactListItem;