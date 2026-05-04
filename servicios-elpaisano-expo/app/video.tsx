import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { AppHeader, ScreenShell } from "../components/Shell";
import { YOUTUBE_VIDEO_URL } from "../data/website";
import { useLanguage } from "../hooks/useLanguage";
import { openExternalUrl } from "../services/native";

const COLORS = {
  bg: "#f3f6fb",
  navyDark: "#102f5a",
  text: "#17345c",
  textSoft: "#5b6f8f",
  white: "#ffffff",
  border: "#dbe4f0",
};

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || null;
}

function getEmbedUrl(url: string) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1`;
}

export default function VideoScreen() {
  const { language } = useLanguage();
  const params = useLocalSearchParams<{ url?: string }>();
  const url = Array.isArray(params.url)
    ? params.url[0] || YOUTUBE_VIDEO_URL
    : params.url || YOUTUBE_VIDEO_URL;
  const embedUrl = getEmbedUrl(url);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={language === "es" ? "Video" : "Video"} />

      <ScreenShell>
        <View style={{ gap: 16, paddingBottom: 36 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              backgroundColor: COLORS.white,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              paddingHorizontal: 14,
              paddingVertical: 10,
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text style={{ color: COLORS.navyDark, fontWeight: "900" }}>
              {language === "es" ? "Regresar" : "Back"}
            </Text>
          </Pressable>

          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: COLORS.border,
              overflow: "hidden",
            }}
          >
            {embedUrl ? (
              <WebView
                source={{ uri: embedUrl }}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                renderLoading={() => (
                  <View
                    style={{
                      height: 230,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator color={COLORS.navyDark} />
                  </View>
                )}
                style={{ height: 230, backgroundColor: "#000000" }}
              />
            ) : (
              <View style={{ padding: 20, gap: 10 }}>
                <Text
                  style={{ color: COLORS.text, fontSize: 20, fontWeight: "900" }}
                >
                  {language === "es"
                    ? "No se pudo cargar el video"
                    : "Video could not load"}
                </Text>
                <Text style={{ color: COLORS.textSoft, lineHeight: 22 }}>
                  {language === "es"
                    ? "El enlace del video no parece ser de YouTube."
                    : "The video link does not look like a YouTube URL."}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={() => openExternalUrl(url, "This device cannot open YouTube.")}
            style={({ pressed }) => ({
              backgroundColor: COLORS.navyDark,
              borderRadius: 16,
              paddingVertical: 15,
              alignItems: "center",
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text style={{ color: COLORS.white, fontSize: 15, fontWeight: "900" }}>
              {language === "es" ? "Abrir en YouTube" : "Open in YouTube"}
            </Text>
          </Pressable>
        </View>
      </ScreenShell>
    </View>
  );
}
