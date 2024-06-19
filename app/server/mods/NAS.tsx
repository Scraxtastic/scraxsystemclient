import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Button, Divider, TextInput } from "@react-native-material/core";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { NetworkManager } from "../../manager/NetworkManager/NetworkManager";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { Buffer } from "buffer";
import { ModMessage } from "../../models/Network/mods/ModMessage";

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
    console.log("NAS", "Updating", props.updateCount, props.data);
    if (props.data === undefined || props.data === null) {
      return;
    }
    console.log("NAS", "Data", props.data);
    const newItem = props.data
      .map((item) => {
        const parsed = JSON.parse(item.message);
        console.log("NAS", "parsed", parsed);
        return parsed;
      })
      .reduce((acc, item) => {
        console.log("NAS", "Item", item, "acc", acc);
        if (item.type === "list") {
          return item;
        }
        return acc;
      }, undefined);
    if (newItem === undefined) {
      console.log("NAS", "No Data");
      return;
    }
    console.log(
      "NAS",
      "Setting Data",
      [{ name: "..", path: "..", isDirectory: true }, ...newItem.data],
      props.updateCount
    );
    setData([{ name: "..", path: "..", isDirectory: true }, ...newItem.data]);
    setPath(newItem.path);
  }, [props.updateCount, props.data]);

  useEffect(() => {
    console.log("Sending list");
    sendMessage({ type: "list" });
  }, []);
  const styles = {
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    itemText: {
      marginLeft: 10,
      fontSize: 18,
    },
  };

  const getSize = (size: number) => {
    if (size < 1024) {
      return `${size}B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)}KB`;
    }
    if (size < 1024 * 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
    return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
  };
  const renderItem = ({ item }) => (
    /**Open modal on click, in which the file can be downloaded, cached, edited or removed
     *
     */
    <TouchableOpacity
      key={item.name}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
      }}
      onPress={() => {
        if (item.isDirectory) {
          sendMessage({ type: "cd", path: item.name });
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          name={item.isDirectory ? "folder" : "insert-drive-file"}
          size={30}
          color="#000"
        />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      {!item.isDirectory && <Text>{getSize(item.size)}</Text>}
      {item.isDirectory && <Text>Dir</Text>}
    </TouchableOpacity>
  );

  return (
    <View key={`NAS-${props.updateCount}`}>
      <View style={{ width: "98%", margin: "1%" }}>
        <Text>{path}</Text>
        {/* <Text>{JSON.stringify(data)}</Text> */}
        <FlatList
          key={"nas"}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      </View>
      {/* <Text>{JSON.stringify(data)}</Text> */}
      <Divider />
    </View>
  );
};
