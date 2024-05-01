import { View } from "react-native";
import { Button, Text } from "@react-native-material/core";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { SocketData } from "../../../models/Network/SocketData";
import { GlobalStore } from "../../../manager/GlobalStore/GlobalStore";
import { DataVisualizer } from "./DataVisualizer";

export interface ServerDataPreviewProps extends SocketData {}

export const ServerDataPreview = (props: ServerDataPreviewProps) => {
  const title = useMemo(() => {
    return `${props.name}`;
  }, [props.name]);
  const globalStore = GlobalStore.getInstance();
  const router = useRouter();
  return (
    <View style={{ marginTop: 5, marginBottom: 10 }}>
      <Button
        title={title}
        onPress={() => {
          globalStore.setActiveServerData(props);
          router.navigate("server/data/ServerDataView");
        }}
        loading={!!props.data}
        loadingIndicatorPosition="trailing"
        loadingIndicator={props.data && <DataVisualizer {...props.data} />}
      />
    </View>
  );
};
