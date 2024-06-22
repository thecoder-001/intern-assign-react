import CustomNavigationBar from "@/components/CustomNavigationBar";
import { Stack } from "expo-router";
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const paperTheme =
  // Sync dynamic colors with system colors
  colorScheme === 'dark'
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };
  return (
    <PaperProvider theme={paperTheme}>
      <Stack screenOptions={{
        // header: (props) => <CustomNavigationBar {...props} />,
        headerShown: false
      }}>
        <Stack.Screen name="index"/>
      </Stack>
    </PaperProvider>
  );
}
