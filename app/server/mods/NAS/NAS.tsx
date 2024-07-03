import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  FlatListProps,
} from "react-native";
import { ModType } from "../../../models/Network/mods/ModType";
import { Button, Divider, TextInput } from "@react-native-material/core";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { NetworkManager } from "../../../manager/NetworkManager/NetworkManager";
import { GlobalStore } from "../../../manager/GlobalStore/GlobalStore";
import { Buffer } from "buffer";
import { ModMessage } from "../../../models/Network/mods/ModMessage";
import { NASItem } from "./NASItem";

export interface NASProps {
  name: string;
  type: ModType;
  data: any[];
  updateCount: number;
}

export const NAS = (props: NASProps) => {
  const [data, setData] = useState<any[]>([]);
  const [path, setPath] = useState<string>("/");
  const sendMessage = async (command: any) => {
    console.log("Sending message", command);
    const globalStore = GlobalStore.getInstance();
    const clientName = globalStore.getActiveServerData().name;

    const netManager = NetworkManager.getInstance();
    netManager.sendEncryptedMessage(
      netManager.socket,
      Buffer.from(
        JSON.stringify({
          target: clientName,
          origin: globalStore.getActiveServer().keyName,
          modname: props.name,
          message: JSON.stringify(command),
          type: "mod",
        })
      ),
      Buffer.from(globalStore.getActiveServer().key, "base64")
    );
  };
  useEffect(() => {
    // console.log("NAS", "Updating", props.updateCount, props.data);
    if (props.data === undefined || props.data === null) {
      return;
    }
    const newItem = props.data
      .map((item) => {
        const parsed = JSON.parse(item.message);
        return parsed;
      })
      .reduce((acc, item) => {
        if (item.type === "list") {
          return item;
        }
        return acc;
      }, undefined);
    if (newItem === undefined) {
      console.log("NAS", "No Data");
      return;
    }
    setData([{ name: "..", path: "..", isDirectory: true }, ...newItem.data]);
    setPath(newItem.path);
  }, [props.updateCount, props.data]);

  useEffect(() => {
    sendMessage({ type: "list" });
  }, []);

  return (
    <View key={`NAS-${props.updateCount}`}>
      <View style={{ width: "98%", margin: "1%" }}>
        <Text>{path}</Text>
        {/* <Text>{JSON.stringify(data)}</Text> */}
        <FlatList
          key={"nas"}
          data={data}
          renderItem={({ item }) => {
            return <NASItem item={item} sendMessage={sendMessage} />;
          }}
          keyExtractor={(item) => item.name}
        />
      </View>
      {/* <Text>{JSON.stringify(data)}</Text> */}
      <Divider />
    </View>
  );
};
