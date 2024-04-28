import { Button, Card, Input, Text } from "@rneui/themed";
import { ServerProps } from "../models/ServerProps";
import { useState } from "react";
import { BasicServer } from "./BasicServer";

export interface AddServerProps {
  server: ServerProps;
  isEditing: boolean;
  onSuccess: (server: ServerProps) => void;
  onCancel: () => void;
}
export const ServerForm = (props: AddServerProps) => {
  const [server, setServer] = useState<ServerProps>({ ...props.server });
  const successText = props.isEditing ? "Update" : "Add";
  const handleSuccess = () => {
    props.onSuccess(server);
  };
  return (
    <Card containerStyle={{ padding: 20, width: 300 }}>
      <BasicServer
        title="Add Server"
        server={server}
        onUpdatedServer={setServer}
      />
      <Card.Divider />
      <Button onPress={handleSuccess}>{successText}</Button>
      <Card.Divider />
      <Button color={"warning"} onPress={props.onCancel}>
        Cancel
      </Button>
    </Card>
  );
};
