import React, { useRef, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Pressable } from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";

const START_URL = "https://servicioselpaisano.com/";

export default function Index() {
  const webRef = useRef<WebView>(null);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Can’t load Servicios El Paisano</Text>
        <Text style={styles.text}>Check your connection and try again.</Text>

        <Pressable style={styles.btn} onPress={() => { setHasError(false); webRef.current?.reload(); }}>
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={() => WebBrowser.openBrowserAsync(START_URL)}>
          <Text style={styles.btnText}>Open in Browser</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{ uri: START_URL }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )}
        onError={() => setHasError(true)}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 12 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  text: { fontSize: 14, opacity: 0.8, textAlign: "center" },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1, width: "100%", alignItems: "center" },
  btnText: { fontSize: 16, fontWeight: "600" },
});
