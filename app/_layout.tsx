import { Link, Stack } from "expo-router";

export const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        statusBarStyle: "light",
        headerTintColor: "rgba(255, 255, 255, 255)",
        headerStyle: { backgroundColor: "black" },
        contentStyle: { backgroundColor: "grey" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerRight(props) {
            return <Link href={"index"}>Add</Link>;
          },
        }}
      />
      <Stack.Screen
        name="server/ServerView"
        options={{ headerTitle: "Server" }}
      />
      <Stack.Screen
        name="server/data/ServerDataView"
        options={{ headerTitle: "ServerView" }}
      />
    </Stack>
  );
};

export default RootLayout;
