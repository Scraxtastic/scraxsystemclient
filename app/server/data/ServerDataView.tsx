import "react-native-gesture-handler";
import { Text } from "react-native";
import { BasicData } from "../../models/Network/BasicData/BasicData";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { SocketData } from "../../models/Network/SocketData";

const ServerDataView = () => {
  const [serverData, setServerData] = useState<SocketData>(
    GlobalStore.getInstance().getActiveServerData()
  );
  useEffect(() => {
    GlobalStore.getInstance().onActiveServerDataUpdate = (data: SocketData) => {
      setServerData(data);
    };
  }, []);
  if (serverData === undefined || serverData === null) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView key={"ServerDataView"}>
      <Text>{serverData.name}</Text>
      <Text>{JSON.stringify(Object.keys(serverData))}</Text>
      {Object.keys(serverData).map((key) => {
        return (
          <Text key={key}>
            {key}: {serverData[key]}
          </Text>
        );
      })}
    </ScrollView>
  );
};
export default ServerDataView;
