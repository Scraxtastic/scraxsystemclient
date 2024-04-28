import { View } from "react-native";
import { Button } from "@react-native-material/core";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SocketData } from "../../models/Network/SocketData";

export interface ServerDataPreviewProps extends SocketData {}

export const ServerDataPreview = (props: ServerDataPreviewProps) => {
  const [title, setTitle] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    console.log("ServerDataPreview:", "useEffect", props);
    setTitle(`${props.name}`);
  });
  return (
    <View style={{ marginTop: 5, marginBottom: 10 }}>
      <Button
        title={title}
        onPress={() => {
          console.log("ServerDataPreview:", "onPress", props);
          router.navigate("server/data/ServerDataView");
        }}
      ></Button>
    </View>
  );
};
