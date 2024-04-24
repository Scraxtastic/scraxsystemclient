import { Button, Card, Input, Text } from "@rneui/themed";
import { ServerProps } from "../models/ServerProps";
import { useState } from "react";

export interface AddServerProps {
  title: string;
  server: ServerProps;
  onUpdatedServer: (server: ServerProps) => void;
}
export const BasicServer = (props: AddServerProps) => {
  const [name, setName] = useState(props.server.name);
  const [ip, setIp] = useState(props.server.ip);
  const [key, setKey] = useState(props.server.key);
  const [keyName, setKeyName] = useState(props.server.keyName);
  return (
    <>
      <Card.Title>{props.title}</Card.Title>
      <Card.Divider />
      <Input
        placeholder="Server Name"
        label="Server Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          props.onUpdatedServer({ name: text, ip, key, keyName });
        }}
      />
      <Input
        placeholder="Server IP"
        label="Server IP"
        value={ip}
        onChangeText={(text) => {
          setIp(text);
          props.onUpdatedServer({ name, ip: text, key, keyName });
        }}
      />
      <Input
        placeholder="Server KeyName"
        label="Server KeyName"
        value={keyName}
        onChangeText={(text) => {
          setKeyName(text);
          props.onUpdatedServer({ name, ip, key, keyName: text });
        }}
      />
      <Input
        placeholder="Server Key"
        label="Server Key"
        value={key}
        onChangeText={(text) => {
          setKey(text);
          props.onUpdatedServer({ name, ip, key: text, keyName });
        }}
      />
    </>
  );
};
