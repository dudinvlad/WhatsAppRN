import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text } from "react-native"
import { useNavigation } from '@react-navigation/native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ContactListItem = ({ user }) => {
    const navigation = useNavigation();

    return(
        <Pressable onPress={() => {}} style={styles.container}>
            <Image 
            style={styles.avatar} 
            source={{uri: user.image}}
            />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
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
        flexDirection: 'row',
        marginBottom: 10,
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    },
});

export default ContactListItem;