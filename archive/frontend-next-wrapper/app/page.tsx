// app/page.tsx
import React, { useRef } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const HOME_URL = "https://servicioselpaisano.com";
const ALLOWED_HOSTS = new Set([
  "servicioselpaisano.com",
  "www.servicioselpaisano.com",
]);

export default function Page() {
  const webviewRef = useRef<WebView>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <WebView
          ref={webviewRef}
          source={{ uri: HOME_URL }}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          allowsBackForwardNavigationGestures
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(req) => {
            // Allow phone/email links (review-friendly)
            if (req.url.startsWith("tel:") || req.url.startsWith("mailto:")) {
              return true;
            }

            // Keep only your domain inside the WebView
            try {
              const url = new URL(req.url);
              return ALLOWED_HOSTS.has(url.hostname);
            } catch {
              // If parsing fails, allow (prevents accidental blocking)
              return true;
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
});
