import { View, Text } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Button, TextInput } from "@react-native-material/core";
import { useState } from "react";
import { NetworkManager } from "../../manager/NetworkManager/NetworkManager";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { Buffer } from "buffer";

export interface ChatProps {
  name: string;
  type: ModType;
}

export const Chat = (props: ChatProps) => {
  const [text, setText] = useState("");
  const sendMessage = async () => {
    const globalStore = GlobalStore.getInstance();

    const netManager = NetworkManager.getInstance();

    console.log("Chat", "Sending mod message");
    await netManager.sendEncryptedMessage(
      netManager.socket,
      Buffer.from(
        JSON.stringify({
          target: globalStore.getActiveServerData().name,
          origin: globalStore.getActiveServer().keyName,
          modname: props.name,
          message: text,
          type: "mod",
        })
      ),
      Buffer.from(globalStore.getActiveServer().key, "base64")
    );
    setText("");
  };
  return (
    <View>
      <Text>Chat</Text>
      <Text>
        {props.name} as {props.type}
      </Text>
      <View style={{ width: "98%", margin: "1%" }}>
        <TextInput
          value={text}
          onChangeText={(text: string) => {
            setText(text);
          }}
        />
        <Button title={"Send"} onPress={sendMessage} />
      </View>
    </View>
  );
};
