import "react-native-gesture-handler";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { SocketData } from "../../models/Network/SocketData";
import { ExtendedDataView } from "./ExtendedDataView";
import { Button, Text } from "@react-native-material/core";

const ServerDataView = () => {
  const [serverData, setServerData] = useState<SocketData>(
    GlobalStore.getInstance().getActiveServerData()
  );
  const [isIpVisible, setIsIpVisible] = useState(false);
  useEffect(() => {
    GlobalStore.getInstance().onActiveServerDataUpdate = (data: SocketData) => {
      console.log("ServerDataView:", "onActiveServerDataUpdate", data);
      setServerData(data);
    };
  }, []);
  if (serverData === undefined || serverData === null) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView key={"ServerDataView"}>
      <Text>{serverData.name}</Text>
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Button
          title={isIpVisible ? "Hide IP" : "Show IP"}
          onPress={() => {
            setIsIpVisible(!isIpVisible);
          }}
        />
        {isIpVisible && <Text>IP: {serverData.ip}</Text>}
      </View>
      {serverData.data && <ExtendedDataView {...serverData.data} />}
      {serverData.data && (
        <Text>Mods:{JSON.stringify(serverData.data.mods)} </Text>
      )}
      <Text></Text>
      <Text>{JSON.stringify(serverData)}</Text>
    </ScrollView>
  );
};
export default ServerDataView;
