import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native"

const ChatListItem = ({ item }) => {
    return(
        <View style={styles.container}>
            <Image 
            style={styles.avatar} 
            source={{uri: item.user.image}}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{item.user.name}</Text>
                    <Text style={styles.subTitle}>{item.lastMessage.createdAt}</Text>
                </View>
                <Text numberOfLines={2} style={styles.subTitle}>
                    {item.lastMessage.text}
                </Text>
            </View>
        </View>
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