import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export interface CollapsibleProps {
  name: string;
  children: JSX.Element | JSX.Element[];
}
export const Collapsible = (props: CollapsibleProps) => {
  const [isExtended, setIsExtended] = useState(true);
  return (
    <View
      style={{
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setIsExtended(!isExtended);
        }}
      >
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text>
            {isExtended ? "-" : ">"}
            {props.name}
          </Text>
        </View>
      </TouchableOpacity>
      {isExtended && props.children}
    </View>
  );
};
