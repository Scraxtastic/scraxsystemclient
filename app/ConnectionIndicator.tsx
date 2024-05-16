import { View, Text } from "react-native";
import { ConnectionStatus } from "./manager/NetworkManager/NetworkManager";
import { useEffect, useState } from "react";

export interface ConnectionIndicatorProps {
  status: ConnectionStatus;
}

export const ConnectionIndicator = (props: ConnectionIndicatorProps) => {
  const [backgroundColor, setBackgroundColor] = useState("Grey");
  useEffect(() => {
    switch (props.status) {
      case "connected":
        setBackgroundColor("green");
        break;
      case "connecting":
        setBackgroundColor("yellow");
        break;
      case "disconnected":
        setBackgroundColor("red");
        break;
      default:
        setBackgroundColor("grey");
        break;
    }
  }, [props.status]);
  return (
    <View
      key={"connectionIndicator"}
      style={{
        backgroundColor: backgroundColor,
        width: 18,
        height: 18,
        borderRadius: 10,
        overflow: "hidden",
      }}
    />
  );
};
