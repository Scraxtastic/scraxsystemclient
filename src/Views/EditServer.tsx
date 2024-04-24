import { Button, Card, Input, Text } from "@rneui/themed";
import { ServerProps } from "../../app/models/ServerProps";
import { useState } from "react";
import { BasicServer } from "./Basics/BasicServer";

export interface EditServerProps {
  server: ServerProps;
  onUpdated: (server: ServerProps) => void;
  onCancel: () => void;
}
export const EditServer = (props: EditServerProps) => {
  const [server, setServer] = useState<ServerProps>(props.server);
  const handleCreate = () => {
    props.onUpdated(server);
  };
  return (
    <Card containerStyle={{ padding: 20, width: 300 }}>
      <BasicServer
        title="Add Server"
        server={server}
        onUpdatedServer={setServer}
      />
      <Card.Divider />
      <Button onPress={handleCreate}>Update Server</Button>
      <Card.Divider />
      <Button color={"warning"} onPress={props.onCancel}>
        Cancel
      </Button>
    </Card>
  );
};
