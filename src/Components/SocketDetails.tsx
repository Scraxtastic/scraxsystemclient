import { Text } from "@rneui/themed";
import { SocketData } from "../Models/SocketData";
import { useMemo } from "react";
import { Buffer } from "buffer";
import { SocketDetailData } from "./SocketDetailData";

export interface SocketDetailsProps {
  socketData: SocketData;
}

export const SocketDetails = (props: SocketDetailsProps) => {
  const { socketData } = props;
//   console.log("SocketDetails", "Rendering", socketData);
  return (
    <>
      <Text h4>{socketData.name}</Text>
      <Text>ip: {socketData.ip}</Text>
      <Text>
        data: {Buffer.from(socketData.data, "base64").toString("utf-8")}
      </Text>
      <SocketDetailData
        key={socketData.name}
        data={JSON.parse(
          Buffer.from(socketData.data, "base64").toString("utf-8")
        )}
      />
    </>
  );
};
