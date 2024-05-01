import { View, Text } from "react-native";
import { RamData, UnitVale } from "../../../models/Network/BasicData/BasicData";
import { Diagram } from "./Diagram";

export interface DataVisualizerProps {
  cpuTemp?: UnitVale;
  cpuLoad?: UnitVale;
  ram: RamData;
}

export const DataVisualizer = (props: DataVisualizerProps) => {
  return (
    <View style={{ flexDirection: "row", gap: 5 }}>
      <Diagram
        current={props.ram?.used}
        max={props.ram?.total}
        min={0}
        text={`RAM`}
        width={"auto"}
      />
      <Diagram
        current={props.cpuLoad?.value}
        max={100}
        min={0}
        text={`CPU`}
        width={"auto"}
      />
      {!!props.cpuTemp && !!props.cpuTemp.unit && (
        <Diagram
          current={props.cpuTemp?.value}
          max={80}
          min={40}
          text={props.cpuTemp?.unit}
          width={"auto"}
        />
      )}
    </View>
  );
};
