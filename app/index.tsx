import "react-native-gesture-handler";
import { Modal, View, Text, ScrollView } from "react-native";
import { Button } from "@react-native-material/core";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import FileManager from "./manager/FileManager/FileManager";
import { useEffect, useState } from "react";
import { ServerProps, createEmptyServerProps } from "./models/ServerProps";
import { GlobalStore } from "./manager/GlobalStore/GlobalStore";
import { BasicServer } from "./server/BasicServer";
import { ServerForm } from "./server/ServerForm";
import { Buffer } from "buffer";

export default function App() {
  /**
   * TODO: Load the initial data for the app with FileManager.
   * TODO: Add FileManager to the new directory.
   * TODO: Add NetworkManager to the new directory
   */
  const dataFolder = "/data";
  const serverFile = dataFolder + "/servers.data";
  const router = useRouter();
  const globalStore = GlobalStore.getInstance();
  const fileManager = FileManager.ensureInstance();
  const [isEditingServer, setIsEditingServer] = useState(
    globalStore.getShallCreateServer()
  );
  const [serverToEdit, setServerToEdit] = useState<ServerProps>(
    createEmptyServerProps()
  );

  const [servers, setServers] = useState<ServerProps[]>([]);
  const saveData = async () => {
    const servers = globalStore.getServers();
    await fileManager.saveFile(
      serverFile,
      Buffer.from(JSON.stringify(servers))
    );
  };
  const loadData = async () => {
    try {
      const serverFileData = await fileManager.readFile(serverFile);
      const servers = JSON.parse(serverFileData.toString()).map(
        (server: ServerProps, index: number) => ({ ...server, id: index })
      );
      globalStore.clearServers();
      globalStore.addServers(servers);
      setServers(servers);
    } catch (e) {
      console.warn("Error loading servers", e);
    }
  };
  useEffect(() => {
    globalStore.onShallCreateServer = (shallCreate: boolean) => {
      setIsEditingServer(shallCreate);
    };
    loadData();
  }, []);
  return (
    <ScrollView>
      <Button
        title={"CLEAR"}
        onPress={async () => {
          await fileManager.saveFile(
            serverFile,
            Buffer.from(JSON.stringify([]))
          );
          await loadData();
        }}
      ></Button>
      {servers?.map((server: ServerProps) => {
        return (
          <View
            style={{
              marginTop: 5,
              marginBottom: 10,
              marginLeft: 2,
              marginRight: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              maxWidth: "100%",
              columnGap: 5,
            }}
            key={server.id}
          >
            <Button
              key={server.ip}
              title={`${server.name} as ${server.keyName}`}
              onPress={() => {
                globalStore.setActiveServer(server);
                router.navigate("server/ServerView");
              }}
              style={{ flex: 1 }}
            />
            <Button
              title={"Edit"}
              onPress={() => {
                setServerToEdit(server);
                setIsEditingServer(true);
              }}
            ></Button>
          </View>
        );
      })}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditingServer}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ServerForm
          server={serverToEdit}
          isEditing={false}
          onSuccess={async (serverProps: ServerProps) => {
            globalStore.addServer(serverProps);
            await saveData();
            await loadData();
            setIsEditingServer(false);
          }}
          onCancel={() => {
            setServerToEdit(createEmptyServerProps());
            setIsEditingServer(false);
          }}
        />
      </Modal>
    </ScrollView>
  );
}
