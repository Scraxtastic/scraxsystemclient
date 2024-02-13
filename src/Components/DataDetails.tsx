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
      const sockets: SocketData[] = JSON.parse(data);
      return sockets.map((socketData: SocketData) => {
        return (
          <SocketDetails
            key={type + "-SocketDetails" + "-" + socketData.name}
            socketData={socketData}
          />
        );
      });
    }
    if (type.toLowerCase() === "socketconnections") {
      const socketConnectionsData: SocketConnectionData[] = JSON.parse(data);
      const elements: React.JSX.Element[] = [];
      elements.push(
        ...socketConnectionsData
          .filter(
            (socketConnectionData: SocketConnectionData) =>
              socketConnectionData.connected > 0
          )
          .map((socketConnectionData: SocketConnectionData) => {
            return (
              <SocketConnectionDetails
                key={
                  type +
                  "-SocketConnectionDetails" +
                  "-" +
                  socketConnectionData.ip
                }
                socketConnectionData={socketConnectionData}
              />
            );
          })
      );
      const failedToConnectIPs: SocketConnectionData[] = socketConnectionsData
        .filter(
          (socketConnectionData: SocketConnectionData) =>
            socketConnectionData.connected <= 0
        )
        .sort((a, b) => {
          if (a.names.length > 0 && b.names.length > 0) {
            return a.lastConnectionTime - b.lastConnectionTime;
          } else if (a.names.length > 0) {
            return -1;
          } else if (b.names.length > 0) {
            return 1;
          }
          return a.lastConnectionTime - b.lastConnectionTime;
        });
      if (failedToConnectIPs.length > 0) {
        elements.push(
          <View style={{ marginLeft: 5 }}>
            <Text h4>Failed to connect IPS</Text>
            {failedToConnectIPs.map(
              (socketConnectionData: SocketConnectionData) => {
                return (
                  <View
                    style={{
                      marginLeft: 5,
                      borderColor: "black",
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  >
                    {Object.keys(socketConnectionData).map((key) => {
                      return (
                        <Text key={key}>
                          {key}: {socketConnectionData[key]}
                        </Text>
                      );
                    })}
                  </View>
                );
              }
            )}
          </View>
        );
        return elements;
      }
    }
    if (type.toLowerCase() === "websockets") {
      const websockets: SocketData[] = JSON.parse(data);
      return websockets.map((websocketData: SocketData) => {
        return (
          <WebSocketDetails
            key={
              type +
              "-WebSocketDetails" +
              "-" +
              websocketData.ip +
              "-" +
              websocketData.port
            }
            socketData={websocketData}
          />
        );
      });
    }
    if (type.toLowerCase() === "websocketconnections") {
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
    console.log("DataDetails", "renderData", "Unknown type", type);
    return <Text>{props.data}</Text>;
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
