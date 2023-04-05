import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

const GroupInfoButton = ({ name, size, color, onPress }) => {
  return(
    <Pressable onPress={onPress}>
      <Feather name={name} size={size} color={color} />
    </Pressable>
  );
};

export default GroupInfoButton;