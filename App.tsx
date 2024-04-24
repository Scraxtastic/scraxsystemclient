import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppHeader } from "./src/Components/AppHeader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BackHandler, View } from "react-native";
import { Overlay } from "@rneui/themed";
import { useEffect, useState } from "react";
import FileManager from "./app/manager/FileManager/FileManager";
import { ServerProps } from "./app/models/ServerProps";
import { Buffer } from "buffer";
import { Servers } from "./src/Views/Servers";
import { AddServer } from "./src/Views/AddServer";
import { OpenServer } from "./src/Views/OpenServer";
import { NetworkManager } from "./src/Network/NetworkManager";
require("./test");

export default function App() {
  const serverFile = "/data/servers.data";
  const [servers, setServers] = useState<ServerProps[]>([]);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [openServer, setOpenServer] = useState<ServerProps>(null);
  const onServerUpdated = async (servers: ServerProps[]) => {
    await FileManager.ensureInstance().saveFile(
      serverFile,
      Buffer.from(JSON.stringify(servers))
    );
    setServers(servers);
  };
  const onCreate = () => {
    setCreating(true);
  };
  const onCreated = async (server: ServerProps) => {
    await onServerUpdated([...servers, server]);
    setCreating(false);
  };
  const onBack = () => {
    if (openServer) {
      setOpenServer(null);
    }
    NetworkManager.instance?.closeConnection();
  };
  BackHandler.addEventListener("hardwareBackPress", () => {
    onBack();
    return true; // true => don't bubble up event
  });

  const loadData = async () => {
    try {
      const serverFileData = await FileManager.ensureInstance().readFile(
        serverFile
      );
      setServers(JSON.parse(serverFileData.toString()));
    } catch (e) {}
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <SafeAreaProvider style={{ backgroundColor: "black" }}>
      <AppHeader
        key="Header"
        onCreate={onCreate}
        onBack={onBack}
        shallRenderBackButton={isBackButtonVisible}
      />
      {!openServer && (
        <View style={{ flex: 1, backgroundColor: "gray" }}>
          <Overlay
            isVisible={isCreating}
            onPressOut={() => {
              setCreating(false);
            }}
          >
            <AddServer
              onCreated={onCreated}
              onCancel={() => {
                setCreating(false);
              }}
            />
          </Overlay>
          <Servers
            key={"servers"}
            servers={servers}
            onUpdatedServer={onServerUpdated}
            onOpenServer={(server: ServerProps) => {
              setOpenServer(server);
            }}
          />
        </View>
      )}
      {openServer && (
        <View style={{ flex: 1, backgroundColor: "gray" }}>
          <OpenServer
            key={openServer.name}
            server={openServer}
            onClosed={() => {
              setOpenServer(null);
            }}
          />
        </View>
      )}

      <StatusBar style="light" hidden={false} />
    </SafeAreaProvider>
  );
}
