import { View, Text } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { useEffect, useMemo, useState } from "react";
import { Divider } from "react-native-elements";
import { NAS } from "./NAS/NAS";
import { Chat } from "./Chat";
import { Collapsible } from "../../components/Collapsible";

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
    const sender = globalData.getActiveServerData().name;
    // console.log(
    //   "Mod",
    //   "updating",
    //   props.name,
    //   props.type,
    //   props.updateCount,
    //   globalData.modStore.getModData(sender, props.name)
    // );
    const newData = globalData.modStore.getModData(sender, props.name);
    if (newData === null) {
      setData([]);
      return;
    }
    // console.log("newDAta", newData, newData === null);
    setData([...globalData.modStore.getModData(sender, props.name)]);
  };
  useEffect(() => {
    updatedServerData();
  }, [props.updateCount]);
  useEffect(() => {
    // console.log("Mod", "Updated Data", data);
  }, [data]);
  //TODO: Extract into collapisbles
  if (props.type === "Chat") {
    return (
      <Collapsible name={props.name}>
        <Chat name={props.name} type={props.type} data={data} />
      </Collapsible>
    );
  }
  if (props.type === "NAS") {
    return (
      <Collapsible name={props.name}>
        <NAS
          name={props.name}
          type={props.type}
          data={data}
          updateCount={props.updateCount}
        />
      </Collapsible>
    );
  }
  return (
    <Collapsible name={props.name}>
        <Text>Not yet available</Text>
      </Collapsible>
  );
};
