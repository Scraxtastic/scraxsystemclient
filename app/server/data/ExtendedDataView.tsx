import { View, Text } from "react-native";
import { BasicData } from "../../models/Network/BasicData/BasicData";
import { DataVisualizer } from "./Preview/DataVisualizer";

export interface ExtendedDataViewProps extends BasicData {}
export const ExtendedDataView = (props: ExtendedDataViewProps) => {
  return (
    <View>
      <DataVisualizer {...props} detailed={true} />
      <Text>
        Latency: {props.latency.value}
        {props.latency.unit}
      </Text>
      <Text>
        CPU Speed: {props.cpuSpeed.value}
        {props.cpuSpeed.unit}
      </Text>
    </View>
  );
};
