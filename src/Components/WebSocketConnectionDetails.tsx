import { Text } from "@rneui/themed";
import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import { SocketDetailData } from "./SocketDetailData";
import { View } from "react-native";
import { WebsocketConnectionData } from "../Models/WebsocketConnectionData";

export interface WebSocketConnectionDetailsProps {
  webSocketConnectionData: WebsocketConnectionData;
}

export const WebSocketConnectionDetails = (
  props: WebSocketConnectionDetailsProps
) => {
  const [isExpanded, setExpanded] = useState(false);
  const { webSocketConnectionData: socketConnectionData } = props;

  const renderData = () => {
    return (
      <>
        <Text>ip: {socketConnectionData.ip}</Text>
        <Text>Names: {socketConnectionData.names.join(", ")}</Text>
      </>
    );
  };
  return (
    <View
      key={"SocketConnections-Details-" + socketConnectionData.ip}
      style={{ marginLeft: 10 }}
    >
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
        {socketConnectionData.names.length > 0 &&
          "Names: " + socketConnectionData.names.join(", ")}
        {socketConnectionData.names.length === 0 &&
          "ip: " + socketConnectionData.ip}
      </Text>
      {isExpanded && renderData()}
    </View>
  );
};
