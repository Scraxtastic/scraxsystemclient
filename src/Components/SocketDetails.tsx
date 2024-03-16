import { Text, Button, Input } from "@rneui/themed";
import { SocketData } from "../Models/SocketData";
import { useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { SocketDetailData } from "./SocketDetailData";
import { View } from "react-native";
import { ModMessage } from "../Models/ModMessage";

export interface SocketDetailsProps {
  socketData: SocketData;
  modMessages: ModMessage[];
  keyName: string;
  sendModMessage: (ModMessage: ModMessage) => void;
}

export const SocketDetails = (props: SocketDetailsProps) => {
  const { socketData, modMessages } = props;
  const [text, setText] = useState<string>("");
  const [isExpanded, setExpanded] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!socketData.data) {
      return;
    }
    try {
      setData(JSON.parse(socketData.data));
    } catch (e) {}
  }, [socketData.data]);

  const getNameInfo = () => {
    const { cpuTemp, cpuLoad, ram } = data;
    const values = [];
    if (cpuTemp) {
      values.push(`${cpuTemp.value}${cpuTemp.unit}`);
    }
    if (cpuLoad) {
      values.push(`${cpuLoad.value}${cpuLoad.unit}`);
    }
    if (ram) {
      values.push(`${ram.used}/${ram.total}${ram.unit}`);
    }
    return values;
  };

  const RenderNameInfo = (entry: string) => {
    return (
      <Text
        key={entry}
        style={{
          marginLeft: 10,
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          padding: 5,
        }}
      >
        {entry}
      </Text>
    );
  };

  const renderData = () => {
    if (socketData === undefined || socketData === null) {
      return <></>;
    }
    return (
      <View style={{ marginLeft: 15 }}>
        <Text>ip: {socketData.ip}</Text>
        {JSON.parse(socketData.data).mods?.map((mod: { name: string }) => {
          let message = "";
          const filteredMessages = modMessages.filter((modMessage) => {
            return modMessage.origin === mod;
          });
          if (filteredMessages.length > 0) {
            message = filteredMessages[0].message;
          }
          return (
            <View
              key={mod.name}
              style={{ borderColor: "black", borderWidth: 1, padding: 10 }}
            >
              <Text key={mod.name}>{mod.name}</Text>
              <Text>{message}</Text>

              <View>
                {props.modMessages.length > 0 && (
                  <Text>{modMessages[0].message}</Text>
                )}
              </View>
              <View>
                <Input
                  placeholder="message"
                  value={text}
                  onChangeText={(text) => {
                    setText(text);
                  }}
                ></Input>
                <Button
                  onPress={() => {
                    props.sendModMessage({
                      target: socketData.name,
                      origin: props.keyName,
                      modname: mod.name,
                      message: text,
                      type: "mod",
                    });
                    setText("");
                  }}
                >
                  Send
                </Button>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <View style={{ marginLeft: 10 }}>
      <View
        onTouchStart={() => {
          setExpanded(!isExpanded);
        }}
        style={{
          borderColor: "black",
          borderStyle: "solid",
          borderWidth: 1,
          marginTop: 10,
          padding: 5,
          marginLeft: 10,
          flexDirection: "row",
        }}
      >
        <Text h4>{socketData.name}</Text>
        {getNameInfo().map(RenderNameInfo)}
      </View>
      {isExpanded && renderData()}
    </View>
  );
};
