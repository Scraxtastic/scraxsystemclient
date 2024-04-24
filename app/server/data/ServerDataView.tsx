import "react-native-gesture-handler";
import { Text } from "react-native";
import { BasicData } from "../../models/Network/basicData/BasicData";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";

const ServerDataView = () => {
  const [serverData, setServerData] = useState<BasicData>(
    GlobalStore.getInstance().getActiveServerData()
  );
  useEffect(() => {
    GlobalStore.getInstance().onActiveServerDataUpdate = (data: BasicData) => {
      setServerData(data);
    };
  }, []);
  return (
    <ScrollView key={"ServerDataView"}>
      <Text>{serverData.name}</Text>
      <Text>{JSON.stringify(serverData)}</Text>
    </ScrollView>
  );
};
export default ServerDataView;
