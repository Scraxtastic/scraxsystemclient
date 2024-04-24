import { Text, View } from "react-native";
import { BasicData } from "../../models/Network/basicData/BasicData";
import { Button } from "@react-native-material/core";
import { NetworkManager } from "../../manager/NetworkManager/NetworkManager";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export interface ServerDataPreviewProps extends BasicData {}

export const ServerDataPreview = (props: ServerDataPreviewProps) => {
  const [title, setTitle] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    // console.log("ServerDataPreview:", "useEffect", props);
    setTitle(`${props} (${JSON.stringify(props.name)})`);
  });
  return (
    <View>
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
