import { forwardRef, PropsWithChildren, ReactNode } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../hooks/useLanguage";

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
  borderSoft: "#e6edf5",
  tabInactive: "#8a97a8",
};

function triggerNavHaptic() {
  if (process.env.EXPO_OS === "web") return;

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export const ScreenShell = forwardRef<
  ScrollView,
  PropsWithChildren<{ scroll?: boolean }>
>(function ScreenShell({
  children,
  scroll = true,
}, ref) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.container, { paddingBottom: 18 + insets.bottom }]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );

  return scroll ? (
    <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );
});

export function AppHeader({
  title,
  showMenu = false,
}: {
  title: string;
  showMenu?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguage();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerLeft}>
        {showMenu ? <Text style={styles.headerMenu}>☰</Text> : null}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.languageSwitch}>
        <Pressable
          onPressIn={triggerNavHaptic}
          onPress={() => setLanguage("en")}
          style={[
            styles.languageOption,
            language === "en" && styles.languageOptionActive,
          ]}
        >
          <Text
            style={[
              styles.languageOptionText,
              language === "en" && styles.languageOptionTextActive,
            ]}
          >
            EN
          </Text>
        </Pressable>

        <Pressable
          onPressIn={triggerNavHaptic}
          onPress={() => setLanguage("es")}
          style={[
            styles.languageOption,
            language === "es" && styles.languageOptionActive,
          ]}
        >
          <Text
            style={[
              styles.languageOptionText,
              language === "es" && styles.languageOptionTextActive,
            ]}
          >
            ES
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function BottomTabs({
  active,
}: {
  active: "home" | "services" | "request" | "contact";
}) {
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();

  const items = [
    {
      key: "home",
      label: language === "es" ? "Inicio" : "Home",
      icon: "⌂",
      route: "/",
    },
    {
      key: "services",
      label: language === "es" ? "Servicios" : "Services",
      icon: "▦",
      route: "/services",
    },
    {
      key: "request",
      label: language === "es" ? "Solicitar" : "Request",
      icon: "▤",
      route: "/request",
    },
    {
      key: "contact",
      label: language === "es" ? "Contacto" : "Contact",
      icon: "◉",
      route: "/contact",
    },
  ] as const;

  return (
    <View style={[styles.tabBarWrap, { paddingBottom: 14 + insets.bottom }]}>
      <View style={styles.tabBar}>
        {items.map((item) => {
          const isActive = item.key === active;

          return (
            <Pressable
              key={item.key}
              onPressIn={triggerNavHaptic}
              style={({ pressed }) => [
                styles.tabItem,
                isActive && styles.tabItemActive,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabActiveText]}>
                {item.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabActiveText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function HeroCard({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
}: {
  title: string;
  subtitle: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <View style={styles.hero}>
      <Text style={styles.heroEyebrow}>SERVICIOS EL PAISANO</Text>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>

      <View style={styles.row}>
        {primaryLabel ? (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
          </Pressable>
        ) : null}

        {secondaryLabel ? (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function SectionCard({
  title,
  children,
  right,
}: PropsWithChildren<{ title: string; right?: ReactNode }>) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {right}
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

export function QuickAction({ label }: { label: string }) {
  return (
    <View style={styles.quickAction}>
      <Text style={styles.quickActionText} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

export function FieldPlaceholder({
  label,
  value,
  tall = false,
}: {
  label: string;
  value: string;
  tall?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, tall && styles.fieldBoxTall]}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 0,
  },

  container: {
    flex: 1,
    paddingTop: 14,
  },

  inner: {
    paddingHorizontal: 20,
    gap: 18,
  },

  header: {
    backgroundColor: COLORS.navy,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerMenu: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
  },

  languageSwitch: {
    flexDirection: "row",
    backgroundColor: "#214f94",
    borderRadius: 18,
    padding: 4,
  },

  languageOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },

  languageOptionActive: {
    backgroundColor: COLORS.white,
  },

  languageOptionText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 13,
  },

  languageOptionTextActive: {
    color: COLORS.navyDark,
  },

  hero: {
    backgroundColor: COLORS.blue,
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  heroEyebrow: {
    color: "#dfe9fb",
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 1.8,
  },

  heroTitle: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 12,
  },

  heroSubtitle: {
    color: "#eef4ff",
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 22,
  },

  row: {
    flexDirection: "row",
    gap: 14,
    flexWrap: "wrap",
  },

  button: {
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 15,
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButton: {
    backgroundColor: COLORS.yellow,
  },

  primaryButtonText: {
    color: COLORS.navyDark,
    fontWeight: "900",
    fontSize: 16,
  },

  secondaryButton: {
    backgroundColor: COLORS.white,
  },

  secondaryButtonText: {
    color: COLORS.navyDark,
    fontWeight: "800",
    fontSize: 16,
  },

  card: {
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
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },

  cardBody: {
    gap: 12,
  },

  quickAction: {
    width: "48%",
    minHeight: 96,
    backgroundColor: COLORS.quickBg,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  quickActionText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 18,
    lineHeight: 24,
  },

  fieldWrap: {
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  fieldBox: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    minHeight: 56,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  fieldBoxTall: {
    minHeight: 110,
    justifyContent: "flex-start",
    paddingTop: 16,
  },

  fieldValue: {
    color: "#8ca0bd",
    fontSize: 16,
  },

  tabBarWrap: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 18,
  },

  tabItemActive: {
    backgroundColor: "#eef3fb",
  },

  tabIcon: {
    fontSize: 18,
    color: COLORS.tabInactive,
    fontWeight: "700",
  },

  tabLabel: {
    fontSize: 13,
    color: COLORS.tabInactive,
    fontWeight: "700",
  },

  tabActiveText: {
    color: COLORS.blue,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.92,
  },
});
