import { useMemo } from "react";
import { View, Text, DimensionValue } from "react-native";

export interface DiagramProps {
  min: number;
  max: number;
  current: number;
  text: string;
  width: DimensionValue;
}

export const Diagram = (props: DiagramProps) => {
  const percentage = useMemo(() => {
    let perc = ((props.current - props.min) / (props.max - props.min)) * 100;
    return perc;
  }, [props.current, props.min, props.max]);
  return (
    <View
      style={{
        backgroundColor: "black",
        padding: 1,
        flexDirection: "row",
        width: props.width,
      }}
    >
      <View
        key={"Diagram-filler"}
        style={{
          position: "absolute",
          height: `${percentage}%`,
          top: `${100 - percentage}%`,
          left: 1,
          backgroundColor: "purple",
          width: "100%",
        }}
      />
      <Text style={{ color: "white", marginLeft: 3, marginRight: 3 }}>{props.text}</Text>
    </View>
  );
};
