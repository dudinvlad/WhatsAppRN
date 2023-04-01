import { FlatList, StyleSheet } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { useEffect, useState } from "react";

const ContactsScreen = () => {
    
    const [users, setUsers] = useState([]);
    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((results) => {
            console.log(results);
            setUsers(results.data?.listUsers?.items);
        })
    }, [])

    return (
        <FlatList
            style={styles.list}
            data={users}
            renderItem ={({ item }) => <ContactListItem user={item}/>}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#FFF',
    },
});

export default ContactsScreen;