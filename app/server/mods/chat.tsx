import { View, Text, ScrollView } from "react-native";
import { ModType } from "../../models/Network/mods/ModType";
import { Button, Divider, TextInput } from "@react-native-material/core";
import { useEffect, useState } from "react";
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
  const [data, setData] = useState<ModMessage[]>([]);
  const sendMessage = async () => {
    if (text === "") {
      return;
    }
    const globalStore = GlobalStore.getInstance();
    const clientName = globalStore.getActiveServerData().name;

    globalStore.modStore.addModData(clientName, props.name, {
      origin: "You",
      message: text,
      target: clientName,
      modname: props.name,
      type: "modFinished",
    });

    const netManager = NetworkManager.getInstance();
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
  useEffect(() => {
    const hasOrigin = (msgs: ModMessage[], origin: string) => {
      for (let i = 0; i < msgs.length; i++) {
        if (msgs[i].origin === origin) {
          return true;
        }
      }
      return false;
    };
    const newData = props.data.reduce(
      (msgs: ModMessage[], entry: ModMessage) => {
        if (msgs.length === 0 || !hasOrigin(msgs, entry.origin)) {
          msgs.push({ ...entry });
          return msgs;
        }
        for (let i = 1; i <= msgs.length; i++) {
          if (msgs[msgs.length - i].origin === entry.origin) {
            if (msgs[msgs.length - i].type === "modFinished") {
              msgs.push({ ...entry });
            } else {
              msgs[msgs.length - i].message += entry.message;
              msgs[msgs.length - i].type = entry.type; // set to modFinished to ensure that every message is displayed
            }
            break;
          }
        }
        return msgs;
      },
      []
    );
    setData(newData);
  }, [props.data]);
  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          borderColor: "black",
          marginLeft: 3,
        }}
      >
        {data?.map((entry: ModMessage, index: number) => {
          return (
            <View
              key={index + "-" + entry.origin}
              style={{
                borderColor: "darkgrey",
                borderRadius: 10,
                borderWidth: 1,
                maxWidth: "80%",
                backgroundColor:
                  entry.origin === "You" ? "lightblue" : "lightgrey",
                alignSelf: entry.origin === "You" ? "flex-end" : "flex-start",
                padding: 5,
                margin: 1,
              }}
            >
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
      <Divider />
    </View>
  );
};
