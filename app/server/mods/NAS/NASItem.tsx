import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export interface NASItemProps {
  item: any;
  sendMessage: (command: any) => void;
}
export const NASItem = (props: NASItemProps) => {
  const styles = {
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    itemText: {
      marginLeft: 10,
      fontSize: 18,
    },
  };

  const getSize = (size: number) => {
    if (size < 1024) {
      return `${size}B`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)}KB`;
    }
    if (size < 1024 * 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    }
    return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
  };
  /**Open modal on click, in which the file can be downloaded, cached, edited or removed
   *
   */
  return (
    <TouchableOpacity
      key={props.item.name}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "darkgray",
      }}
      onPress={() => {
        console.log("OnPress", props.item.isDirectory, props.item.name);
        if (props.item.isDirectory) {
          props.sendMessage({ type: "cd", path: props.item.name });
        } else {
          props.sendMessage({
            type: "read",
            path: props.item.name,
            fileName: props.item.name,
          });
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          name={props.item.isDirectory ? "folder" : "insert-drive-file"}
          size={30}
          color={props.item.isDirectory ? "#FF9913" : "blue"}
        />
        <Text style={styles.itemText}>{props.item.name}</Text>
      </View>
      {!props.item.isDirectory && <Text>{getSize(props.item.size)}</Text>}
      {props.item.isDirectory && <Text>Dir</Text>}
    </TouchableOpacity>
  );
};
