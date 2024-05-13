import { View, Text } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Chat } from "./chat";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { useEffect, useMemo, useState } from "react";
import { Divider } from "react-native-elements";

export interface ModProps {
  name: string;
  type: ModType;
  updateCount: number;
}

export const Mod = (props: ModProps) => {
  const globalData = GlobalStore.getInstance();
  const [data, setData] = useState<any[]>([]);
  const updatedServerData = () => {
    const sender = globalData.getActiveServerData().name;
    globalData.modStore.getModData(sender, props.name);
    setData(globalData.modStore.getModData(sender, props.name));
  };
  useEffect(() => {
    updatedServerData();
  }, [props.updateCount]);
  if (props.type === "Chat") {
    return <Chat name={props.name} type={props.type} data={data} />;
  }
  return (
    <View style={{ marginBottom: 20 }}>
      <Text>Mod</Text>
      <Text>
        {props.name} as {props.type} not yet implemented.
      </Text>
    </View>
  );
};
