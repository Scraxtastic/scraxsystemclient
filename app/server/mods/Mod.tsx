import { View, Text } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Chat } from "./chat";

export interface ModProps {
  name: string;
  type: ModType;
}

export const Mod = (props: ModProps) => {
  if (props.type === "Chat") {
    return <Chat name={props.name} type={props.type} />;
  }
  return (
    <View>
      <Text>Mod</Text>
      <Text>
        {props.name} as {props.type} not yet implemented.
      </Text>
    </View>
  );
};
