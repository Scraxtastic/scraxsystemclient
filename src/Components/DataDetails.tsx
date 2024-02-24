import { Text } from "@rneui/themed";
import { useState } from "react";
import { SocketData } from "../Models/SocketData";
import { SocketDetails } from "./SocketDetails";
import { SocketConnectionDetails } from "./SocketConnectionDetails";
import { SocketConnectionData } from "../Models/SocketConnectionData";
import { WebSocketDetails } from "./WebSocketDetails";
import { View } from "react-native";
export interface DataDetailsProps {
  title: string;
  data: string;
  type: string;
}

export const DataDetails = (props: DataDetailsProps) => {
  const { title, data, type } = props;
  const [isExpanded, setExpanded] = useState(false);

  const renderData = () => {
    if (type.toLowerCase() === "sockets") {
      // console.log("DataDetails", "renderData", "Sockets");
      const sockets: SocketData[] = JSON.parse(data);
      return sockets.map((socketData: SocketData) => {
        // console.log("socketDAta", socketData);
        return (
          <SocketDetails
            key={type + "-SocketDetails" + "-" + socketData.name}
            socketData={socketData}
          />
        );
      });
    }
    if (type.toLowerCase() === "connections") {
      // console.log("DataDetails", "renderData", "WebSocketConnections");
      const websocketConnectionsData: SocketConnectionData[] = JSON.parse(data);
      return websocketConnectionsData.map(
        (websocketConnectionData: SocketConnectionData) => {
          return (
            <SocketConnectionDetails
              key={
                type +
                "-WebSocketConnectionDetails" +
                "-" +
                websocketConnectionData.names.join("-") +
                "-" +
                websocketConnectionData.lastConnectionTime
              }
              socketConnectionData={websocketConnectionData}
            />
          );
        }
      );
    }
    // console.log("DataDetails", "renderData", "Unknown type", type);
    // return <Text>{props.data}</Text>;
    return <></>;
  };

  return (
    <>
      <Text
        h3
        style={{
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          marginTop: 10,
          padding: 5,
        }}
        onPress={() => {
          setExpanded(!isExpanded);
        }}
      >
        {props.title}
      </Text>
      {isExpanded && renderData()}
    </>
  );
};
