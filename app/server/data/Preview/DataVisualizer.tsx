import { View, Text } from "react-native";
import { RamData, UnitVale } from "../../../models/Network/BasicData/BasicData";
import { Diagram } from "./Diagram";
import { useMemo } from "react";

export interface DataVisualizerProps {
  cpuTemp?: UnitVale;
  cpuLoad?: UnitVale;
  ram: RamData;
  detailed?: boolean;
}

export const DataVisualizer = (props: DataVisualizerProps) => {
  const ramText = useMemo(() => {
    return props.detailed
      ? `RAM: ${props.ram?.used} / ${props.ram?.total} ${props.ram?.unit}`
      : "RAM";
  }, [props.ram, props.detailed]);
  const cpuText = useMemo(() => {
    return props.detailed ? `CPU: ${props.cpuLoad?.value}%` : "CPU";
  }, [props.cpuLoad, props.detailed]);
  const cpuTempText = useMemo(() => {
    return props.detailed
      ? `Temp: ${props.cpuTemp?.value} ${props.cpuTemp?.unit}`
      : props.cpuTemp?.unit;
  }, [props.cpuTemp, props.detailed]);
  return (
    <View style={{ flexDirection: "row", gap: 5 }}>
      <Diagram
        current={props.ram?.used}
        max={props.ram?.total}
        min={0}
        text={ramText}
        width={"auto"}
      />
      {!!props.cpuLoad && (
        <Diagram
          current={props.cpuLoad?.value}
          max={100}
          min={0}
          text={cpuText}
          width={"auto"}
        />
      )}
      {!!props.cpuTemp && !!props.cpuTemp.unit && (
        <Diagram
          current={props.cpuTemp?.value}
          max={80}
          min={30}
          text={cpuTempText}
          width={"auto"}
        />
      )}
    </View>
  );
};
