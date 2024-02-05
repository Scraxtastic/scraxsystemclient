import { View } from "react-native";
import { Server } from "../Models/Server";
import { Text, Button } from "@rneui/themed";
import { NetworkManager } from "../Network/NetworkManager";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { DataDetails } from "../Components/DataDetails";

export interface OpenServerProps {
  server: Server;
  onClosed: () => void;
}

export const OpenServer = (props: OpenServerProps) => {
  const [data, setData] = useState<string>("");
  const [dataObject, setDataObject] = useState<any>({});

  useEffect(() => {
    try {
      setDataObject(JSON.parse(data));
    } catch (e) {
      console.log("OpenServer", "Could not parse data", e);
    }
  }, [data]);

  useEffect(() => {
    const { ip, name, key, keyName } = props.server;
    if (!ip) {
      console.log(
        "OpenServer",
        "Could not create Server. Attribute Missing: IP"
      );
      return;
    }
    if (!keyName) {
      console.log(
        "OpenServer",
        "Could not create Server. Attribute Missing: keyName"
      );
      return;
    }
    if (!key) {
      console.log(
        "OpenServer",
        "Could not create Server. Attribute Missing: Key"
      );
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
      <Button>Test</Button>
      {dataObject &&
        Object.keys(dataObject).map((key) => (
          <DataDetails
            key={key}
            title={key}
            data={JSON.stringify(dataObject[key])}
          />
        ))}
    </>
  );
};
