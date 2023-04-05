import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../screens/ChatScreen";
import MainTabNavigator from "./MainTabNavigator";
import ContactsScreen from "../screens/ContactsScreen";
import NewGroupScreen from "../screens/NewGroupScreen";
import GroupInfoScreen from "../screens/GroupInfoScreen";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "whitesmoke" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="NewGroup" component={NewGroupScreen} />
        <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
