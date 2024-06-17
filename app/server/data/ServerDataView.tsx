import "react-native-gesture-handler";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { SocketData } from "../../models/Network/SocketData";
import { ExtendedDataView } from "./ExtendedDataView";
import { Button, Text } from "@react-native-material/core";
import { Chat } from "../mods/Chat";
import { Mod } from "../mods/Mod";
import { Divider } from "react-native-elements";

const ServerDataView = () => {
  const globalStore = GlobalStore.getInstance();
  const [serverData, setServerData] = useState<SocketData>(
    globalStore.getActiveServerData()
  );
  const [isIpVisible, setIsIpVisible] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  useEffect(() => {
    globalStore.onActiveServerDataUpdate = (data: SocketData) => {
      setServerData(data);
    };
  }, []);

  globalStore.modStore.onModDataUpdate = () => {
    setUpdateCount((updateCount) => updateCount + 1);
  };
  if (serverData === undefined || serverData === null) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView
      key={"ServerDataView"}
      style={{ marginLeft: 1, marginRight: 1 }}
    >
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Button
          title={isIpVisible ? "Hide IP" : "Show IP"}
          onPress={() => {
            setIsIpVisible(!isIpVisible);
          }}
        />
        {isIpVisible && <Text>IP: {serverData.ip}</Text>}
      </View>
      {/* <Text>serverdata: {JSON.stringify(serverData.data)}</Text> */}
      {serverData.data && <ExtendedDataView {...serverData.data} />}
      {/* {serverData.data && (
        <Text>Mods:{JSON.stringify(serverData.data.mods)} </Text>
      )} */}
      <Divider />
      {serverData.data.mods?.map((mod, index) => {
        return (
          <View key={"mod-" + mod.name + "-" + mod.type}>
            <Mod
              key={"mod-" + mod.name + "-" + mod.type}
              name={mod.name}
              type={mod.type}
              updateCount={updateCount}
            />
            <Divider />
          </View>
        );
      })}
    </ScrollView>
  );
};
export default ServerDataView;
