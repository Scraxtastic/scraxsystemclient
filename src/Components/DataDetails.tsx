import { Text } from "@rneui/themed";
export interface DataDetailsProps {
  title: string;
  data: string;
}

export const DataDetails = (props: DataDetailsProps) => {
  return (
    <>
      <Text h1>{props.title}</Text>
      <Text>{props.data}</Text>
    </>
  );
};
