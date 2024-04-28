import "react-native-gesture-handler";
import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { ServerProps } from "../models/ServerProps";
import { GlobalStore } from "../manager/GlobalStore/GlobalStore";
import { NetworkManager } from "../manager/NetworkManager/NetworkManager";
import { ModMessage } from "../models/Network/mods/ModMessage";
import { Buffer } from "buffer";
import { BasicData } from "../models/Network/BasicData/BasicData";
import { ServerDataPreview } from "./data/ServerDataPreview";
import { useNavigation } from "expo-router";
import { ConnectionMessage } from "../models/Network/ConnectionMessage";
import { MessageData } from "../models/Network/MessageData";
import { SocketData } from "../models/Network/SocketData";

const ServerView = () => {
  const [server, setServer] = useState<ServerProps>();
  const [serverData, setServerData] = useState<SocketData[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const networkManager: NetworkManager = NetworkManager.getInstance();
    // Add back handler to disconnect from server on back press
    const onBackPress = () => {
      console.log("ServerView:", "onBackPress");
      networkManager.closeConnection();
      navigation.removeListener("beforeRemove", onBackPress);
      return true;
    };
    navigation.addListener("beforeRemove", onBackPress);
    // Connect to Server
    console.log("ServerView:", "useEffect");
    const server = GlobalStore.getInstance().getActiveServer();
    networkManager.onConnect = (data: string) => {
      console.log("ServerView:", "onConnect", data);
    };
    networkManager.onUpdate = (dataText: string) => {
      console.log("ServerView:", "onUpdate", serverData, serverData.map);
      const globalStore = GlobalStore.getInstance();
      const activeServer = globalStore.getActiveServer();
      const data: ConnectionMessage = JSON.parse(dataText);
      if (data.type === "data") {
        const messageData: MessageData = JSON.parse(data.message);
        const updatedServerData: SocketData[] = [...serverData, ...messageData.sockets];
        const activeServerDataSets: SocketData[] = updatedServerData.filter(
          (data) => data.name === activeServer?.name
        );
        if (activeServerDataSets.length > 0) {
          globalStore.setActiveServerData(activeServerDataSets[0]);
        }
        setServerData(updatedServerData);
      }
    };
    networkManager.onModUpdate = (data: ModMessage[]) => {
      console.log("ServerView:", "onModUpdate", data);
    };
    networkManager.onError = (error: string) => {
      console.log("ServerView:", "onError", error);
    };
    const { ip, key, keyName } = server;
    if (server.ip.includes("localhost")) {
      networkManager.connectTo(
        "ws://" + ip,
        keyName,
        Buffer.from(key, "base64")
      );
    } else {
      networkManager.connectTo(
        "wss://" + ip,
        keyName,
        Buffer.from(key, "base64")
      );
    }
    setServer(server);
  }, []);

  return (
    <ScrollView key={"ServerView-" + server?.id + "-" + server?.name}>
      {serverData.map((currentServerData: SocketData) => {
        console.log("ServerView:", "currentServerData", currentServerData);
        return (
          <ServerDataPreview
            key={currentServerData.name}
            {...currentServerData}
          ></ServerDataPreview>
        );
      })}
    </ScrollView>
  );
};

export default ServerView;
