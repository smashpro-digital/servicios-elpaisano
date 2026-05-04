import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { AppHeader, ScreenShell } from "../components/Shell";
import { WEBSITE_BASE_URL, YOUTUBE_VIDEO_URL } from "../data/website";
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

const VIDEO_REFERRER_ORIGIN = WEBSITE_BASE_URL;

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || null;
}

function getEmbedUrl(url: string) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const params = new URLSearchParams({
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    origin: VIDEO_REFERRER_ORIGIN,
    widget_referrer: VIDEO_REFERRER_ORIGIN,
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function getEmbedHtml(embedUrl: string) {
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
        background: #000;
      }
      iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        background: #000;
      }
    </style>
  </head>
  <body>
    <iframe
      src="${embedUrl}"
      title="Servicios El Paisano YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  </body>
</html>`;
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
            {embedUrl && Platform.OS === "web" ? (
              React.createElement("iframe", {
                src: embedUrl,
                title: "Servicios El Paisano YouTube video",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowFullScreen: true,
                referrerPolicy: "strict-origin-when-cross-origin",
                style: {
                  width: "100%",
                  height: 230,
                  border: 0,
                  display: "block",
                  backgroundColor: "#000000",
                },
              })
            ) : embedUrl ? (
              <WebView
                source={{
                  html: getEmbedHtml(embedUrl),
                  baseUrl: VIDEO_REFERRER_ORIGIN,
                }}
                originWhitelist={["https://*", "about:blank"]}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
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
