import { View } from "react-native";
import { Server } from "../Models/Server";
import { Text, Button } from "@rneui/themed";
import { NetworkManager } from "../Network/NetworkManager";
import { useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { DataDetails } from "../Components/DataDetails";
import { SocketDetails } from "../Components/SocketDetails";
import { SocketData } from "../Models/SocketData";

export interface OpenServerProps {
  server: Server;
  onClosed: () => void;
}

export const OpenServer = (props: OpenServerProps) => {
  const [data, setData] = useState<string>("");
  const [dataObject, setDataObject] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      setDataObject(parsedData);
    } catch (e) {
      setErrorMessage("Error parsing data");
    }
  }, [data]);

  useEffect(() => {
    const { ip, name, key, keyName } = props.server;
    if (!ip) {
      setErrorMessage("Could not create Server. Attribute Missing: IP");
      return;
    }
    if (!keyName) {
      setErrorMessage("Could not create Server. Attribute Missing: keyName");
      return;
    }
    if (!key) {
      setErrorMessage("Could not create Server. Attribute Missing: Key");
      return;
    }
    const netManager = new NetworkManager();
    netManager.onUpdate = (data: string) => {
      setData(data);
    };
    console.log("OpenServer", "Connecting to", ip, keyName, key);
    netManager.onUpdate = setData;
    netManager.connectTo("ws://" + ip, keyName, Buffer.from(key, "base64"));
  }, []);

  return (
    <>
      <Text h1>{props.server.name}</Text>
      <Text>{errorMessage}</Text>
      {dataObject &&
        Object.keys(dataObject).map((key) => {
          // Not the best way to handle this, but it works for now
          if (key === "sockets") {
            const sockets = dataObject[key];
            return sockets.map((socketData: SocketData) => {
              return (
                <SocketDetails
                  key={key + "-SocketDetails" + "-" + socketData.name}
                  socketData={socketData}
                />
              );
            });
          }
          return (
            <DataDetails
              key={key + "-DataDetails"}
              title={key}
              data={JSON.stringify(dataObject[key])}
            />
          );
        })}
    </>
  );
};
