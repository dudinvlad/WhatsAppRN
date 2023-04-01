import { Button, StyleSheet } from "react-native"
import { View } from "react-native"
import { Auth } from 'aws-amplify';
import { Alert } from "react-native";

const onPressLogout = () => {
    Alert.alert(
        'Are you sure you what to sign out?',
        '',
        [
            {
                text: 'Cancel', onPress: () => {}, style: 'cancel'
            },
            {
                text: 'Sign out', onPress: () => Auth.signOut(), style: 'destructive'
            }
        ],
        {cancelable: false},
    );
};

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Button onPress={onPressLogout} color={'red'} title="Logout"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logout: {
        padding: 10,
    },
});

export default SettingsScreen;

