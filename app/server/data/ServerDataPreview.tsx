import { View } from "react-native";
import { Button, Text } from "@react-native-material/core";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SocketData } from "../../models/Network/SocketData";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";

export interface ServerDataPreviewProps extends SocketData {}

export const ServerDataPreview = (props: ServerDataPreviewProps) => {
  const [title, setTitle] = useState<string>("");
  const globalStore = GlobalStore.getInstance();
  const router = useRouter();
  useEffect(() => {
    setTitle(`${props.name}`);
  });
  return (
    <View style={{ marginTop: 5, marginBottom: 10 }}>
      <Button
        title={title}
        onPress={() => {
          globalStore.setActiveServerData(props);
          router.navigate("server/data/ServerDataView");
        }}
      />
    </View>
  );
};
