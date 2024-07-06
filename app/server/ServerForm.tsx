import { Button, Card, Input, Text } from "@rneui/themed";
import { ServerProps } from "../models/ServerProps";
import { useState } from "react";
import { BasicServer } from "./BasicServer";
import { Alert, View } from "react-native";
import Modal from "react-native-modal";

export interface AddServerProps {
  server: ServerProps;
  isEditing: boolean;
  onSuccess: (server: ServerProps) => void;
  onDelete: (server: ServerProps) => void;
  onCancel: () => void;
}
export const ServerForm = (props: AddServerProps) => {
  const [server, setServer] = useState<ServerProps>({ ...props.server });
  const [isDeleting, setIsDeleting] = useState(false);
  const successText = props.isEditing ? "Update" : "Add";
  const handleSuccess = () => {
    props.onSuccess(server);
  };
  return (
    <Card
      containerStyle={{ backgroundColor: "darkgray", borderColor: "black" }}
    >
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
      <Card.Divider />
      {props.isEditing && (
        <Button
          color={"error"}
          onPress={() => {
            setIsDeleting(true);
          }}
        >
          Delete
        </Button>
      )}
      <Modal
        isVisible={isDeleting}
        onDismiss={() => {
          setIsDeleting(false);
        }}
        style={{}}
      >
        <Card
          containerStyle={{ backgroundColor: "darkgray", borderColor: "black" }}
        >
          <Text h3>Are you sure you want to delete this server?</Text>
          <Button
            color="error"
            onPress={() => {
              props.onDelete(server);
              setIsDeleting(false);
            }}
          >
            Yes
          </Button>
          <Card.Divider />
          <Button color="primary" onPress={() => setIsDeleting(false)}>
            No
          </Button>
        </Card>
      </Modal>
    </Card>
  );
};
