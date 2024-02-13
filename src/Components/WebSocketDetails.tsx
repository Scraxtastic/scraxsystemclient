import { Text } from "@rneui/themed";
import { SocketData } from "../Models/SocketData";
import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import { SocketDetailData } from "./SocketDetailData";
import { WebsocketData } from "../Models/WebsocketData";
import { View } from "react-native";

export interface WebSocketDetailsProps {
  socketData: WebsocketData;
}

export const WebSocketDetails = (props: WebSocketDetailsProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const { socketData } = props;
  //   console.log("SocketDetails", "Rendering", socketData);

  const renderData = () => {
    return (
      <>
        <Text>ip: {socketData.ip}</Text>
      </>
    );
  };
  return (
    <View style={{ marginLeft: 10 }}>
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
        }}
      >
        {socketData.name}
      </Text>
      {isExpanded && renderData()}
    </View>
  );
};
