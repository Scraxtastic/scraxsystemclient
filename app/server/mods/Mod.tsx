import { View, Text } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Chat } from "./Chat";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { useEffect, useMemo, useState } from "react";
import { Divider } from "react-native-elements";
import { NAS } from "./NAS";

export interface ModProps {
  name: string;
  type: ModType;
  updateCount: number;
}

export const Mod = (props: ModProps) => {
  const globalData = GlobalStore.getInstance();
  const [data, setData] = useState<any[]>([]);
  const [isExtended, setIsExtended] = useState(true);
  const updatedServerData = () => {
    console.log("Mod", "updating", props.name, props.type, props.updateCount);
    const sender = globalData.getActiveServerData().name;
    globalData.modStore.getModData(sender, props.name);
    setData(globalData.modStore.getModData(sender, props.name));
  };
  useEffect(() => {
    updatedServerData();
  }, [props.updateCount]);
  //TODO: Extract into collapisbles
  if (props.type === "Chat") {
    return (
      <View>
        <Text
          onPress={() => {
            setIsExtended(!isExtended);
          }}
        >
          {props.name}
        </Text>
        {isExtended && <Chat name={props.name} type={props.type} data={data} />}
      </View>
    );
  }
  if (props.type === "NAS") {
    return (
      <View>
        <Text
          onPress={() => {
            setIsExtended(!isExtended);
          }}
        >
          {props.name}
        </Text>
        {isExtended && (
          <NAS
            name={props.name}
            type={props.type}
            data={data}
            updateCount={props.updateCount}
          />
        )}
      </View>
    );
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
