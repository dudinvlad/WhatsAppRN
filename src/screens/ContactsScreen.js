import { FlatList, StyleSheet } from "react-native";
import chats from '../../assets/data/chats.json';
import ContactListItem from "../components/ContactListItem";

const ContactsScreen = () => {
    return (
        <FlatList
            style={styles.list}
            data={chats}
            renderItem ={({ item }) => <ContactListItem user={item.user}/>}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#FFF',
    },
});

export default ContactsScreen;