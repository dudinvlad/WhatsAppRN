import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
dayjs.extend(relativeTime);

const ContactListItem = ({
  onPress = () => {},
  user,
  selectable = false,
  isSelected = false,
}) => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image style={styles.avatar} source={{ uri: user.image }} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.subTitle} numberOfLines={2}>
            {user.status}
          </Text>
        </View>
      </View>
      {selectable &&
        (isSelected ? (
          <AntDesign name="checkcircle" size={24} color="royalblue" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="lightgray" />
        ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
    borderBottomColor: "lightgray",
    justifyContent: "center",
    marginRight: 10,
  },
  row: {
    flexDirection: "column",
    marginBottom: 10,
  },
  name: {
    flex: 1,
    fontWeight: "bold",
  },
  subTitle: {
    color: "gray",
    flexWrap: "wrap",
    paddingTop: 5,
  },
});

export default ContactListItem;
