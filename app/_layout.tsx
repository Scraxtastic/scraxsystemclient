import { Button } from "@react-native-material/core";
import { Link, Stack, router, useNavigation } from "expo-router";
import { Modal, View } from "react-native";
import { BasicServer } from "./server/BasicServer";
import { ServerProps } from "./models/ServerProps";
import { useState } from "react";
import { GlobalStore } from "./manager/GlobalStore/GlobalStore";



export const RootLayout = () => {
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
        options={{ headerTitle: "Server" }}
      />
      <Stack.Screen
        name="server/data/ServerDataView"
        options={{ headerTitle: "ServerView" }}
      />
    </Stack>
  );
};

export default RootLayout;
