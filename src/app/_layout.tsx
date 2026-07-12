import { useFonts } from "expo-font";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getDb } from "../lib/SqliteHelper";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter_28pt-Regular.ttf"),
    Outfit: require("../assets/fonts/Outfit-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Inicializar la base de datos cuando la app se inicia
    getDb().catch((err) => {
      console.error("Failed to initialize database", err);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const scheme = useColorScheme() ?? "light";

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack initialRouteName="index">
          {/* Guardia de rol — siempre entra aquí primero */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(seller)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={scheme === "dark" ? "dark" : "light"}></StatusBar>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
