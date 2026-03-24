import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LanguageProvider } from "../hooks/useLanguage";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const t = setTimeout(() => {
      (async () => {
        try {
          if (!isMounted) return;
          setReady(true);
          await SplashScreen.hideAsync();
        } catch {
          if (isMounted) setReady(true);
        }
      })();
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f3f6fb" },
          }}
        />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}