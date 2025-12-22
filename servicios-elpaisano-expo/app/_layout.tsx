import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore if it's already prevented
});

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
          // if hide fails, allow app to continue anyway
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

  return <Stack screenOptions={{ headerShown: false }} />;
}
