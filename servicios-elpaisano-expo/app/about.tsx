import { Image, Pressable, Text, View } from "react-native";
import { AppHeader, BottomTabs, ScreenShell } from "../components/Shell";
import {
  ABOUT_COPY,
  PHONE_NUMBER,
  WEBSITE_IMAGE_URLS,
} from "../data/website";
import { useLanguage } from "../hooks/useLanguage";
import { useSiteContent } from "../hooks/useSiteContent";
import { tText } from "../services/content";
import { callPhoneNumber } from "../services/native";

const COLORS = {
  bg: "#f3f6fb",
  navyDark: "#102f5a",
  text: "#17345c",
  textSoft: "#5b6f8f",
  white: "#ffffff",
  yellow: "#f2c84b",
  card: "#ffffff",
  border: "#dbe4f0",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 28,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 16,
      }}
    >
      {children}
    </View>
  );
}

function FounderImage({ uri, label }: { uri: string; label: string }) {
  return (
    <View style={{ gap: 10 }}>
      <Image
        source={{ uri }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: 240,
          borderRadius: 20,
          backgroundColor: "#e8edf4",
        }}
      />
      <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "900" }}>
        {label}
      </Text>
    </View>
  );
}

export default function AboutScreen() {
  const { language } = useLanguage();
  const { content } = useSiteContent();
  const founders = content.about?.founders?.length
    ? content.about.founders
    : [
        { name: "Santos Chavez", imageSrc: WEBSITE_IMAGE_URLS.santos },
        { name: "Carmen Hernandez", imageSrc: WEBSITE_IMAGE_URLS.carmen },
      ];
  const phone = content.office?.phone || PHONE_NUMBER;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={language === "es" ? "Acerca" : "About"} />

      <ScreenShell>
        <View style={{ gap: 18, paddingBottom: 120 }}>
          <Card>
            <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: "900" }}>
              {tText(
                content.about?.title,
                language,
                language === "es"
                  ? "Acerca de Servicios El Paisano"
                  : "About Servicios El Paisano"
              )}
            </Text>
            <Text
              selectable
              style={{ color: COLORS.textSoft, fontSize: 16, lineHeight: 24 }}
            >
              {tText(content.about?.body, language, ABOUT_COPY[language])}
            </Text>
            <Pressable
              onPress={() => callPhoneNumber(phone)}
              style={({ pressed }) => ({
                backgroundColor: COLORS.yellow,
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: "center",
                opacity: pressed ? 0.94 : 1,
              })}
            >
              <Text
                style={{
                  color: COLORS.navyDark,
                  fontWeight: "900",
                  fontSize: 16,
                }}
              >
                {phone}
              </Text>
            </Pressable>
          </Card>

          <Card>
            {founders.map((founder) => (
              <FounderImage
                key={founder.name}
                uri={founder.imageSrc}
                label={founder.name}
              />
            ))}
          </Card>
        </View>
      </ScreenShell>

      <BottomTabs active="contact" />
    </View>
  );
}
