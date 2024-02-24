import { Text } from "@rneui/themed";
import { SocketData } from "../Models/SocketData";
import { useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { SocketDetailData } from "./SocketDetailData";
import { View } from "react-native";

export interface SocketDetailsProps {
  socketData: SocketData;
}

export const SocketDetails = (props: SocketDetailsProps) => {
  const { socketData } = props;
  const [isExpanded, setExpanded] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!socketData.data) {
      return;
    }
    try {
      setData(JSON.parse(socketData.data));
    } catch (e) {}
  }, [socketData.data]);

  const getNameInfo = () => {
    const { cpuTemp, cpuLoad, ram } = data;
    const values = [];
    if (cpuTemp) {
      values.push(`${cpuTemp.value}${cpuTemp.unit}`);
    }
    if (cpuLoad) {
      values.push(`${cpuLoad.value}${cpuLoad.unit}`);
    }
    if (ram) {
      values.push(`${ram.used}/${ram.total}${ram.unit}`);
    }
    return values;
  };

  const RenderNameInfo = (entry: string) => {
    return (
      <Text
        key={entry}
        style={{
          marginLeft: 10,
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          padding: 5
        }}
      >
        {entry}
      </Text>
    );
  };

  const renderData = () => {
    return (
      <View style={{ marginLeft: 15 }}>
        <Text>ip: {socketData.ip}</Text>
      </View>
    );
  };
  return (
    <View style={{ marginLeft: 10 }}>
      <View
        onTouchStart={() => {
          setExpanded(!isExpanded);
        }}
        style={{
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          marginTop: 10,
          padding: 5,
          marginLeft: 10,
          flexDirection: "row",
        }}
      >
        <Text h4>{socketData.name}</Text>
        {getNameInfo().map(RenderNameInfo)}
      </View>
      {isExpanded && renderData()}
    </View>
  );
};
