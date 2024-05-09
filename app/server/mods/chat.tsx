import { View, Text } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Button, TextInput } from "@react-native-material/core";
import { useState } from "react";
import { NetworkManager } from "../../manager/NetworkManager/NetworkManager";
import { GlobalStore } from "../../manager/GlobalStore/GlobalStore";
import { Buffer } from "buffer";
import { ModMessage } from "../../models/Network/mods/ModMessage";

export interface ChatProps {
  name: string;
  type: ModType;
  data: any[];
}

export const Chat = (props: ChatProps) => {
  const [text, setText] = useState("");
  const sendMessage = async () => {
    if (text === "") {
      return;
    }
    const globalStore = GlobalStore.getInstance();
    const clientName = globalStore.getActiveServerData().name;

    globalStore.modStore.addModData(clientName, props.name, {
      origin: "You",
      message: text,
    });

    const netManager = NetworkManager.getInstance();

    console.log("Chat", "Sending mod message");
    netManager.sendEncryptedMessage(
      netManager.socket,
      Buffer.from(
        JSON.stringify({
          target: clientName,
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
      <Text>{props.name}</Text>
      <View style={{ borderWidth: 1, borderColor: "black", marginLeft: 3 }}>
        {props.data?.map((entry: ModMessage, index: number) => {
          return (
            <View key={index + "-" + entry.origin}>
              <Text>
                {entry.origin}: {entry.message}
              </Text>
            </View>
          );
        })}
      </View>
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
