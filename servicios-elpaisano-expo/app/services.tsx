import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  AppHeader,
  BottomTabs,
  ScreenShell,
} from "../components/Shell";
import { useLanguage } from "../hooks/useLanguage";
import { SERVICE_CATEGORIES, WEBSITE_SERVICES } from "../data/website";
import { useSiteContent } from "../hooks/useSiteContent";

const COLORS = {
  bg: "#f3f6fb",
  navy: "#143b73",
  navyDark: "#102f5a",
  blue: "#1f56a6",
  text: "#17345c",
  textSoft: "#5b6f8f",
  white: "#ffffff",
  yellow: "#f2c84b",
  card: "#ffffff",
  quickBg: "#eef3fb",
  border: "#dbe4f0",
};

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 28,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {title ? (
        <Text
          style={{
            color: COLORS.text,
            fontSize: 24,
            fontWeight: "900",
            marginBottom: 16,
          }}
        >
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function SummaryBar({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          color: "#8091ab",
          fontSize: 16,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function Chip({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: active ? "#dce9ff" : "#f3f6fb",
        borderWidth: 1,
        borderColor: active ? "#bfd4fb" : COLORS.border,
        marginRight: 10,
      }}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 14,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function ServiceCard({
  title,
  subtitle,
  ctaLabel,
  serviceValue,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  serviceValue: string;
}) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/request",
          params: { service: serviceValue },
        })
      }
      style={({ pressed }) => ({
        backgroundColor: COLORS.white,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 18,
        marginBottom: 14,
        opacity: pressed ? 0.95 : 1,
      })}
    >
      <Text
        style={{
          color: COLORS.text,
          fontSize: 20,
          fontWeight: "900",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: COLORS.textSoft,
          fontSize: 15,
          lineHeight: 22,
          marginBottom: 14,
        }}
      >
        {subtitle}
      </Text>

      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#eef3fb",
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 14,
        }}
      >
        <Text
          style={{
            color: COLORS.navy,
            fontWeight: "800",
            fontSize: 14,
          }}
        >
          {ctaLabel}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ServicesScreen() {
  const { language } = useLanguage();
  const { content } = useSiteContent();
  const categories = SERVICE_CATEGORIES[language];
  const services = content.services?.length ? content.services : WEBSITE_SERVICES;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={language === "es" ? "Servicios" : "Services"} />

      <ScreenShell>
        <View style={{ gap: 18, paddingBottom: 120 }}>
          <Card>
            <SummaryBar
              label={
                language === "es"
                  ? "Traduccion, interpretacion, notaria, impuestos, telefonos, pagos, vehiculos, pasaportes y mas."
                  : "Translation, interpretation, notary, taxes, phones, bill pay, vehicles, passports, and more."
              }
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 8 }}
              style={{ marginBottom: 10 }}
            >
              {categories.map((category, index) => (
                <Chip
                  key={category}
                  label={category}
                  active={index === 0}
                />
              ))}
            </ScrollView>

            <Text
              style={{
                color: COLORS.text,
                fontSize: 22,
                fontWeight: "900",
                marginTop: 4,
                marginBottom: 14,
              }}
            >
              {language === "es" ? "Servicios del Sitio Web" : "Website Services"}
            </Text>

            {services.map((service) => (
              <ServiceCard
                key={service.title.en}
                title={service.title[language]}
                subtitle={service.subtitle[language]}
                ctaLabel={language === "es" ? "Solicitar Servicio" : "Request Service"}
                serviceValue={service.title.en}
              />
            ))}
          </Card>
        </View>
      </ScreenShell>

      <BottomTabs active="services" />
    </View>
  );
}
