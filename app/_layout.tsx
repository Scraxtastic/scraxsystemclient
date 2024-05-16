import { Button } from "@react-native-material/core";
import { Link, Stack, router, useNavigation } from "expo-router";
import { Modal, View } from "react-native";
import { BasicServer } from "./server/BasicServer";
import { ServerProps } from "./models/ServerProps";
import { useEffect, useState } from "react";
import { GlobalStore } from "./manager/GlobalStore/GlobalStore";
import { SocketData } from "./models/Network/SocketData";
import {
  ConnectionStatus,
  NetworkManager,
} from "./manager/NetworkManager/NetworkManager";
import { ConnectionIndicator } from "./ConnectionIndicator";

export const RootLayout = () => {
  const globalStore = GlobalStore.getInstance();
  const [serverData, setServerData] = useState<ServerProps>(
    globalStore.getActiveServer()
  );
  const [clientData, setClientData] = useState<SocketData>(
    globalStore.getActiveServerData()
  );
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  useEffect(() => {
    globalStore.onActiveServerUpdate = (data: ServerProps) => {
      setServerData(data);
    };
    globalStore.onActiveServerDataUpdateLayout = (data: SocketData) => {
      setClientData(data);
    };
    NetworkManager.getInstance().onConnectionStatusChange = (
      status: ConnectionStatus
    ) => {
      setConnectionStatus(status);
    };
  }, []);
  return (
    <Stack
      screenOptions={{
        statusBarStyle: "light",
        statusBarColor: "black",
        headerTintColor: "rgba(255, 255, 255, 255)",
        headerStyle: { backgroundColor: "black" },
        contentStyle: { backgroundColor: "grey" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerRight(props) {
            return (
              <View>
                <Button
                  color="rgb(70, 70, 70)"
                  tintColor="white"
                  title="Add"
                  onPress={() => {
                    GlobalStore.getInstance().setShallCreateServer(true);
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        name="server/ServerView"
        options={{
          headerTitle: serverData?.name,
          headerRight(props) {
            return (
              <ConnectionIndicator
                key={"ConnectionIndicator"}
                status={connectionStatus}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="server/data/ServerDataView"
        options={{
          headerTitle: clientData?.name,
          headerRight(props) {
            return (
              <ConnectionIndicator
                key={"ConnectionIndicator"}
                status={connectionStatus}
              />
            );
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;
