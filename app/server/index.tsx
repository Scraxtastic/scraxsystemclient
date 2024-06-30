import { router } from "expo-router";
import { Text } from "react-native";

const server = () => {
  router.navigate("server/ServerView");
  return <Text>Rerouting...</Text>;
};
