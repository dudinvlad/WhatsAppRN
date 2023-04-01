import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './src/navigation';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsConfig from './src/aws-exports';
import { useEffect } from 'react';
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';

Amplify.configure({ ...awsConfig, Analytics: {disabled: true}});

function App() {

  useEffect(() => {
    const syncUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});

      const userData = await API.graphql(
        graphqlOperation(
          getUser, { id: authUser.attributes?.sub }
        )
      )

      if (userData.data.getUser) {
        return;
      }

      const newUser = {
        id: authUser.attributes.sub,
        name: authUser.attributes.name,
        status: 'Hey, I am using WhatsApp!',
        image: '',
      }

      await API.graphql(
        graphqlOperation(createUser, {input: newUser})
      );

    }

    syncUser();
  }, []);

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
      label: 'Full name',
      key: 'name',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 2,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 3,
      type: 'string',
    },
  ],
}

const usernameAttributes = 'Email';

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes
});