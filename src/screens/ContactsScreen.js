import { FlatList, StyleSheet } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { useEffect, useState } from "react";

const ContactsScreen = () => {

    const fetchUsersAndFilter = async () => {
        const authUser = await Auth.currentAuthenticatedUser();
        API.graphql(graphqlOperation(listUsers)).then((results) => {
            const filterUsers = results.data?.listUsers?.items.filter(user => user.id !== authUser.attributes.sub)
            setUsers(filterUsers);
        })
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchUsersAndFilter();
    }, [])

    return (
        <FlatList
            style={styles.list}
            data={users}
            renderItem={({ item }) => <ContactListItem user={item} />}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#FFF',
    },
});

export default ContactsScreen;