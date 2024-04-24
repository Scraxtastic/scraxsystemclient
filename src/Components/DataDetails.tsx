import { Text } from "@rneui/themed";
import { useState } from "react";
import { SocketData } from "../Models/SocketData";
import { SocketDetails } from "./SocketDetails";
import { SocketConnectionDetails } from "./SocketConnectionDetails";
import { SocketConnectionData } from "../Models/SocketConnectionData";
import { WebSocketDetails } from "./WebSocketDetails";
import { View } from "react-native";
import { ModMessage } from "../Models/ModMessage";
export interface DataDetailsProps {
  title: string;
  data: string;
  modData: ModMessage[];
  type: string;
  keyName: string;
  sendModMessage: (modMessage: ModMessage) => void;
}

export const DataDetails = (props: DataDetailsProps) => {
  const { title, data, type } = props;
  const [isExpanded, setExpanded] = useState(true);

  const renderData = () => {
    if (type.toLowerCase() === "sockets") {
      const sockets: any[] = JSON.parse(data);
      console.log("Sockets: ", sockets);
      const socketData: SocketData[] = sockets.map((socketData: any) => {
        if (
          socketData.data === undefined ||
          socketData.data === null ||
          socketData.data === ""
        ) {
          return socketData;
        }
        socketData.data = JSON.parse(socketData.data);
        return socketData;
      });
      return socketData.map((socketData: SocketData) => {
        return (
          <SocketDetails
            key={type + "-SocketDetails" + "-" + socketData.name}
            keyName={props.keyName}
            socketData={socketData}
            modMessages={props.modData}
            sendModMessage={(modMessage: ModMessage) => {
              props.sendModMessage(modMessage);
            }}
          />
        );
      });
    }
    if (type.toLowerCase() === "connections") {
      setExpanded(false);
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
