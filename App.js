import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './src/navigation';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsConfig from './src/aws-exports';

Amplify.configure({ ...awsConfig, Analytics: {disabled: true}});

function App() {
  return (
    <View style={styles.container}>
      <Navigator/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
  },
});

const signUpConfig = {
  hiddenDefaults: ['phone_number', 'username'],
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'string',
    },
  ],
}

const usernameAttributes = 'Email';

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes
});