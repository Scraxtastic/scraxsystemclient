import "react-native-gesture-handler";
import { View } from "react-native";
import { Button } from "@react-native-material/core";
import { useRouter } from "expo-router";
import FileManager from "./manager/FileManager/FileManager";
import { useEffect, useState } from "react";
import { ServerProps } from "./models/ServerProps";
import { GlobalStore } from "./manager/GlobalStore/GlobalStore";

export default function App() {
  /**
   * TODO: Load the initial data for the app with FileManager.
   * TODO: Add FileManager to the new directory.
   * TODO: Add NetworkManager to the new directory
   */
  const serverFile = "/data/servers.data";
  const router = useRouter();
  const [servers, setServers] = useState<ServerProps[]>([]);
  const loadData = async () => {
    try {
      const serverFileData = await FileManager.ensureInstance().readFile(
        serverFile
      );
      const servers = JSON.parse(serverFileData.toString()).map(
        (server: ServerProps, index: number) => ({ ...server, id: index })
      );
      GlobalStore.getInstance().addServers(servers);
      setServers(servers);
    } catch (e) {}
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <View>
      {servers?.map((server: ServerProps) => {
        return (
          <View style={{ marginTop: 5, marginBottom: 10 }} key={server.ip}>
            <Button
              key={server.ip}
              title={`${server.name} as ${server.keyName}`}
              onPress={() => {
                GlobalStore.getInstance().setActiveServer(server);
                router.navigate("server/ServerView");
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
