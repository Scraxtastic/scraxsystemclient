import { Text } from "@rneui/themed";
import { SocketData } from "../Models/SocketData";
import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import { SocketDetailData } from "./SocketDetailData";
import { View } from "react-native";

export interface SocketDetailsProps {
  socketData: SocketData;
}

export const SocketDetails = (props: SocketDetailsProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const { socketData } = props;
  //   console.log("SocketDetails", "Rendering", socketData);

  const renderData = () => {
    return (
      <>
        <Text>ip: {socketData.ip}</Text>
        <Text>
          data: {Buffer.from(socketData.data, "base64").toString("utf-8")}
        </Text>
        <SocketDetailData
          key={socketData.name}
          data={JSON.parse(
            Buffer.from(socketData.data, "base64").toString("utf-8")
          )}
        />
      </>
    );
  };
  return (
    <View  style={{ marginLeft: 10 }}>
      <Text
        h4
        onPress={() => {
          setExpanded(!isExpanded);
        }}
        style={{
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          marginTop: 10,
          padding: 5,
          marginLeft: 10,
        }}
      >
        {socketData.name}
      </Text>
      {isExpanded && renderData()}
    </View>
  );
};
