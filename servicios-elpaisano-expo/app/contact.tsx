import { Pressable, Text, View } from "react-native";
import {
  AppHeader,
  BottomTabs,
  ScreenShell,
} from "../components/Shell";

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

function ActionButton({
  label,
  primary,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: primary ? COLORS.yellow : COLORS.white,
        borderWidth: primary ? 0 : 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 12,
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
        {label}
      </Text>
    </Pressable>
  );
}

function InfoRow({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: COLORS.textSoft,
          fontSize: 16,
          lineHeight: 24,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

export default function ContactScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title="Contact" />

      <ScreenShell>
        <View style={{ gap: 18, paddingBottom: 120 }}>
          <Card title="Contact Us">
            <ActionButton label="Call 423-265-2528" primary />
            <ActionButton label="Email servicioselpaisano@gmail.com" />
            <ActionButton label="Get Directions" />

            <View
              style={{
                height: 1,
                backgroundColor: COLORS.border,
                marginVertical: 8,
              }}
            />

            <InfoRow
              title="Office"
              body="2740 Dodds Ave, Chattanooga, TN"
            />
            <InfoRow
              title="Hours"
              body={
                "Monday-Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 3:00 PM\nSunday: Closed"
              }
            />
            <InfoRow
              title="Languages"
              body="English and Spanish"
            />
          </Card>

          <Card title="Stay Connected">
            <Text
              style={{
                color: COLORS.textSoft,
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 14,
              }}
            >
              Add your Facebook, Instagram, WhatsApp, or other social links here.
            </Text>

            <ActionButton label="Facebook" />
            <ActionButton label="Instagram" />
          </Card>
        </View>
      </ScreenShell>

      <BottomTabs active="contact" />
    </View>
  );
}