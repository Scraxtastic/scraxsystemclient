import { Button, Card, Input, Text } from "@rneui/themed";
import { ServerProps } from "../../app/models/ServerProps";
import { useState } from "react";
import { BasicServer } from "./Basics/BasicServer";

export interface AddServerProps {
  onCreated: (server: ServerProps) => void;
  onCancel: () => void;
}
export const AddServer = (props: AddServerProps) => {
  const [server, setServer] = useState<ServerProps>({
    name: "",
    ip: "",
    key: "",
    keyName: "",
  });
  const handleCreate = () => {
    props.onCreated(server);
  };
  return (
    <Card containerStyle={{ padding: 20, width: 300 }}>
      <BasicServer
        title="Add Server"
        server={server}
        onUpdatedServer={setServer}
      />
      <Card.Divider />
      <Button onPress={handleCreate}>Add Server</Button>
      <Card.Divider />
      <Button color={"warning"} onPress={props.onCancel}>
        Cancel
      </Button>
    </Card>
  );
};
