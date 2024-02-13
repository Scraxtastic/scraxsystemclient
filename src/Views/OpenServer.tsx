import { ScrollView, View } from "react-native";
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
  const [connectionErrorMessage, setConnectionErrorMessage] =
    useState<string>("");

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      if (
        parsedData.type === "connectInformation" ||
        parsedData.type === "connectionInformation"
      ) {
        delete parsedData.type;
        setDataObject({ ...dataObject, ...parsedData });
        setErrorMessage("");
        return;
      }
    } catch (e) {
      setErrorMessage("Error parsing data" + "\n" + data);
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
    netManager.onError = (error: string) => {
      setConnectionErrorMessage(error);
    };
    console.log("OpenServer", "Connecting to", ip, keyName, key);
    netManager.onUpdate = setData;
    netManager.connectTo("wss://" + ip, keyName, Buffer.from(key, "base64"));
  }, []);

  return (
    <ScrollView>
      <Text h1>{props.server.name}</Text>
      {errorMessage && <Text>{errorMessage}</Text>}
      {connectionErrorMessage && <Text>{connectionErrorMessage}</Text>}
      {dataObject &&
        Object.keys(dataObject).map((key) => {
          return (
            <DataDetails
              key={key + "-DataDetails"}
              title={key}
              type={key}
              data={JSON.stringify(dataObject[key])}
            />
          );
        })}
    </ScrollView>
  );
};
