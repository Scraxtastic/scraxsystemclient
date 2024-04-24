import { Button, Icon, Overlay, Text } from "@rneui/themed";
import { ServerProps } from "../../app/models/ServerProps";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { EditServer } from "./EditServer";

export interface ServersProps {
  servers: ServerProps[];
  onUpdatedServer: (servers: ServerProps[]) => void;
  onOpenServer: (server: ServerProps) => void;
}

export const Servers = (props: ServersProps) => {
  const [isEditing, setEditing] = useState(false);
  const [editingServerIndex, setEditingServerIndex] = useState<number>(-1);
  return (
    <ScrollView>
      {props.servers.map((server: ServerProps, index: number) => {
        const key = server.name + "-" + server.ip;
        return (
          <View
            key={key}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              position: "relative",
              marginTop: 5,
              marginBottom: 5,
              maxWidth: "100%",
              columnGap: 5,
            }}
          >
            <Button
              key={key + "-open"}
              containerStyle={{ width: "88%" }}
              buttonStyle={{ height: 40 }}
              onPress={() => {
                props.onOpenServer(server);
              }}
            >
              {server.name} ({server.ip})
            </Button>
            <Button
              key={key + "-edit"}
              color={"orange"}
              buttonStyle={{ height: 40 }}
              onPress={() => {
                setEditingServerIndex(index);
                setEditing(true);
              }}
            >
              <Icon name="edit" />
            </Button>
          </View>
        );
      })}

      <Overlay
        isVisible={isEditing}
        onPressOut={() => {
          setEditing(false);
        }}
      >
        <EditServer
          server={props.servers[editingServerIndex]}
          onUpdated={(server: ServerProps) => {
            const servers = [...props.servers];
            servers[editingServerIndex] = server;
            props.onUpdatedServer(servers);
            setEditing(false);
          }}
          onCancel={() => {
            setEditing(false);
          }}
        />
      </Overlay>
    </ScrollView>
  );
};
