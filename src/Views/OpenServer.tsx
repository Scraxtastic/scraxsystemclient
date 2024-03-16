import { ScrollView, View } from "react-native";
import { Server } from "../Models/Server";
import { Text, Button } from "@rneui/themed";
import { NetworkManager } from "../Network/NetworkManager";
import { useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { DataDetails } from "../Components/DataDetails";
import { ConnectionMessage } from "../Models/ConnectionMessage";
import { ModMessage } from "../Models/ModMessage";

export interface OpenServerProps {
  server: Server;
  onClosed: () => void;
}

export const OpenServer = (props: OpenServerProps) => {
  const [data, setData] = useState<string>("");
  const [modData, setModData] = useState<ModMessage[]>([]);
  const [dataObject, setDataObject] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [connectionErrorMessage, setConnectionErrorMessage] =
    useState<string>("");
  const [netManager, setNetManager] = useState<NetworkManager>(null);

  const onSetData = (data: string) => {
    // console.log("OpenServer", "Data Received", data);
    setData(data);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    try {
      const parsedData: ConnectionMessage = JSON.parse(data);
      if (parsedData.type === "data") {
        delete parsedData.type;
        // console.log("OpenServer", "Data Parsed", parsedData);
        setDataObject({ ...dataObject, ...JSON.parse(parsedData.message) });
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
      onSetData(data);
    };
    netManager.onError = (error: string) => {
      setConnectionErrorMessage(error);
    };
    netManager.onModUpdate = (modMessages: ModMessage[]) => {
      setModData((prevModData) => {
        for (let modMessage of modMessages) {
          const foundMod = prevModData.filter(
            (mod) => mod.origin === modMessage.origin
          );
          if (foundMod.length > 0) {
            prevModData = prevModData.map((mod) => {
              if (mod.origin === modMessage.origin) {
                // console.log(
                //   `Found and adding text ${modMessage.message} to ${mod.message}`
                // );
                mod.message += modMessage.message;
                // console.log("changed to", mod.message);
              }
              return mod;
            });
          } else {
            // console.log("Adding new mod", modMessage);
            prevModData = [...prevModData, modMessage];
          }
        }
        return prevModData;
      });
    };
    // console.log("OpenServer", "Connecting to", ip, keyName, key);
    // netManager.onUpdate = setData;
    netManager.connectTo("wss://" + ip, keyName, Buffer.from(key, "base64"));
    setNetManager(netManager);
  }, []);

  return (
    <ScrollView>
      <Text h1>{props.server.name}</Text>
      {errorMessage && <Text>{errorMessage}</Text>}
      {connectionErrorMessage && <Text>{connectionErrorMessage}</Text>}
      {dataObject &&
        Object.keys(dataObject)
          .filter((key) => {
            if (key === "type") {
              return false;
            }
            return true;
          })
          .map((key) => {
            return (
              <DataDetails
                key={key + "-DataDetails"}
                keyName={props.server.keyName}
                title={key}
                type={key}
                data={JSON.stringify(dataObject[key])}
                modData={modData}
                sendModMessage={(modMessage: ModMessage) => {
                  console.log("Sending", modMessage, "to server");
                  netManager.sendEncryptedMessage(
                    netManager.socket,
                    Buffer.from(JSON.stringify(modMessage)),
                    Buffer.from(props.server.key, "base64")
                  );
                }}
              />
            );
          })}
    </ScrollView>
  );
};
