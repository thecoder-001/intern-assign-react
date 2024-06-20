import CustomNavigationBar from "@/components/CustomNavigationBar";
import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
      }}>
        <Stack.Screen name="index"/>
      </Stack>
    </PaperProvider>
  );
}
