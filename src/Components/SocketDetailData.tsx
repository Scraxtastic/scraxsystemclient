import { Text } from "@rneui/themed";
import { View } from "react-native";
export interface SocketDetailDataProps {
  data: any;
}

export const SocketDetailData = (props: SocketDetailDataProps) => {
  const { data } = props;
  const keys = Object.keys(data);
  return (
    <>
      {keys.map((key) => {
        return (
          <View key={key}>
            <Text>{key}</Text>
            <Text>{data[key]}</Text>
          </View>
        );
      })}
    </>
  );
};
