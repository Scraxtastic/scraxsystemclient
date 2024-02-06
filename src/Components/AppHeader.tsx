import { AppBar } from "@react-native-material/core";
import { Button, Header, Icon } from "@rneui/themed";

export interface AppHeaderProps {
  onCreate: () => void;
  onBack: () => void;
  shallRenderBackButton: boolean;
}
export const AppHeader = (props: AppHeaderProps) => {
  const leftComponent = (
    <Button
      buttonStyle={{ backgroundColor: "rgba(0,0,0,0)", padding: 0, margin: 0 }}
      icon={<Icon name="arrow-back" size={25} color="white" />}
      onPress={() => {
        props.onBack();
      }}
    />
  );
  const rightComponent = (
    <Button
      buttonStyle={{ backgroundColor: "rgba(0,0,0,0)", padding: 0, margin: 0 }}
      icon={<Icon name="add" size={25} color="white" />}
      onPress={() => {
        props.onCreate();
      }}
    />
  );

  return (
    <Header
      backgroundColor="black"
      leftComponent={leftComponent}
      centerComponent={{ text: "Scrax System", style: { color: "#fff" } }}
      rightComponent={rightComponent}
    />
  );
};
