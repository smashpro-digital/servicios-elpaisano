import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { AppHeader, BottomTabs, ScreenShell } from "../components/Shell";
import { useSiteContent } from "../hooks/useSiteContent";
import { useLanguage } from "../hooks/useLanguage";
import { tText } from "../services/content";

const { width } = Dimensions.get("window");

const COLORS = {
  bg: "#eef1f6",
  navy: "#143b73",
  navySoft: "#1f4f95",
  navyDark: "#102f5a",
  text: "#17345c",
  textSoft: "#5b6f8f",
  white: "#ffffff",
  yellow: "#f2cf57",
  card: "#ffffff",
  quickBg: "#edf2fa",
  border: "#d8e0ec",
  dot: "#c3cee1",
};

const LOCAL_SLIDE_FALLBACKS: ImageSourcePropType[] = [
  require("../assets/slides/office.jpg"),
  require("../assets/slides/taxes.jpg"),
  require("../assets/slides/services.jpg"),
  require("../assets/slides/community.jpg"),
];

// const LOGO_FALLBACK = require("../assets/images/icon.png");

type SlideItem = {
  id: string;
  title: { en: string; es: string };
  subtitle?: { en: string; es: string };
  imageSrc?: string;
  eyebrow?: { en: string; es: string };
};

function getLocalFallback(index: number): ImageSourcePropType {
  return LOCAL_SLIDE_FALLBACKS[index % LOCAL_SLIDE_FALLBACKS.length];
}

function BrandStrip() {
  return (
    <View
      style={{
        backgroundColor: "#e8edf4",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Image
        source={LOGO_FALLBACK}
        resizeMode="contain"
        style={{ width: 170, height: 42 }}
      /> */}
    </View>
  );
}

function HomeSlide({
  slide,
  index,
  failedRemoteSlides,
  setFailedRemoteSlides,
}: {
  slide: SlideItem;
  index: number;
  failedRemoteSlides: Record<string, boolean>;
  setFailedRemoteSlides: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}) {
  const { language } = useLanguage();

  const hasRemote = !!slide.imageSrc && slide.imageSrc.trim().length > 0;
  const useRemote = hasRemote && !failedRemoteSlides[slide.id];

  const source: ImageSourcePropType = useRemote
    ? { uri: slide.imageSrc!.trim() }
    : getLocalFallback(index);

  return (
    <View
      style={{
        width: width - 40,
        borderRadius: 26,
        overflow: "hidden",
        backgroundColor: COLORS.white,
      }}
    >
      <BrandStrip />

      <ImageBackground
        source={source}
        resizeMode="cover"
        onError={() => {
          if (useRemote) {
            setFailedRemoteSlides((prev) => ({ ...prev, [slide.id]: true }));
          }
        }}
        style={{
          height: 220,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.12)",
            flex: 1,
          }}
        />
      </ImageBackground>

      <View
        style={{
          backgroundColor: COLORS.navySoft,
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 20,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 18,
            fontWeight: "800",
            marginBottom: 8,
          }}
        >
          {tText(slide.title, language)}
        </Text>

        <Text
          style={{
            color: "#eaf1ff",
            fontSize: 14,
            lineHeight: 22,
            marginBottom: 16,
          }}
        >
          {tText(
            slide.subtitle,
            language,
            language === "es"
              ? "Sirviendo a la comunidad de Chattanooga por más de 20 años."
              : "Serving the Chattanooga community for over 20 years."
          )}
        </Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.push("/request")}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: COLORS.yellow,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text
              style={{
                color: COLORS.navyDark,
                fontWeight: "900",
                fontSize: 15,
              }}
            >
              {language === "es" ? "Solicitar Servicio" : "Request Service"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/contact")}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: COLORS.white,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text
              style={{
                color: COLORS.navyDark,
                fontWeight: "900",
                fontSize: 15,
              }}
            >
              {language === "es" ? "Llamar" : "Call Now"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function HomeHeaderCarousel({ slides }: { slides: SlideItem[] }) {
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedRemoteSlides, setFailedRemoteSlides] = useState<Record<string, boolean>>({});
  const slideWidth = useMemo(() => width - 40, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * slideWidth,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, slideWidth, slides.length]);

  return (
    <View>
      <ScrollView
        ref={(ref) => {
          scrollRef.current = ref;
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / slideWidth
          );
          setActiveIndex(index);
        }}
        style={{
          borderRadius: 26,
          overflow: "hidden",
        }}
      >
        {slides.map((slide, index) => (
          <HomeSlide
            key={slide.id}
            slide={slide}
            index={index}
            failedRemoteSlides={failedRemoteSlides}
            setFailedRemoteSlides={setFailedRemoteSlides}
          />
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        {slides.map((slide, index) => (
          <Pressable
            key={slide.id}
            onPress={() => {
              scrollRef.current?.scrollTo({
                x: index * slideWidth,
                animated: true,
              });
              setActiveIndex(index);
            }}
            style={{
              width: activeIndex === index ? 26 : 10,
              height: 10,
              borderRadius: 999,
              backgroundColor:
                activeIndex === index ? COLORS.navySoft : COLORS.dot,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function OfficeCard({
  hours,
  address,
  directionsLabel,
}: {
  hours: string[];
  address: string;
  directionsLabel: string;
}) {
  const { language } = useLanguage();

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: "#edf2fa",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 20 }}>⌖</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "900",
              marginBottom: 4,
            }}
          >
            {language === "es" ? "Horario de Oficina" : "Office Hours"}
          </Text>
          {hours.map((line) => (
            <Text
              key={line}
              style={{
                color: COLORS.textSoft,
                fontSize: 15,
                lineHeight: 23,
              }}
            >
              {line}
            </Text>
          ))}
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#e5eaf2",
          marginVertical: 12,
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: "#edf2fa",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 20 }}>⌂</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 16,
              fontWeight: "800",
              lineHeight: 24,
            }}
          >
            {address}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/contact")}
        style={({ pressed }) => ({
          backgroundColor: COLORS.yellow,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
          opacity: pressed ? 0.92 : 1,
        })}
      >
        <Text
          style={{
            color: COLORS.navyDark,
            fontWeight: "900",
            fontSize: 15,
          }}
        >
          {directionsLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function PromoBanner() {
  const { language } = useLanguage();

  return (
    <View
      style={{
        backgroundColor: COLORS.navySoft,
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: "#f6e07a",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Text
          style={{
            color: COLORS.navyDark,
            fontWeight: "900",
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {language === "es" ? "20 AÑOS" : "20 YEAR"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 15,
            fontWeight: "800",
            marginBottom: 4,
          }}
        >
          {language === "es"
            ? "20 años sirviendo a la comunidad!"
            : "Serving the community for 20 years!"}
        </Text>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 26,
            fontWeight: "900",
            marginBottom: 2,
          }}
        >
          {language === "es" ? "IMPUESTOS" : "TAXES"}
        </Text>
        <Text
          style={{
            color: "#eaf1ff",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {language === "es" ? "¡Ahora con cupón!" : "Now with coupon!"}
        </Text>
      </View>
    </View>
  );
}

function QuickActionItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: "48%",
        minHeight: 110,
        backgroundColor: COLORS.quickBg,
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 18,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Text
        numberOfLines={2}
        style={{
          color: COLORS.text,
          fontSize: 17,
          fontWeight: "900",
          lineHeight: 23,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function Index() {
  const content = useSiteContent();
  const { language } = useLanguage();

  const slides =
    content.home?.slides && content.home.slides.length > 0
      ? content.home.slides
      : [
          {
            id: "fallback-1",
            title: {
              en: "Servicios El Paisano",
              es: "Servicios El Paisano",
            },
            subtitle: {
              en: "Serving the Chattanooga community for over 20 years.",
              es: "Sirviendo a la comunidad de Chattanooga por más de 20 años.",
            },
          },
        ];

  const quickActions =
    content.quickActions?.length
      ? content.quickActions
      : [
          { label: { en: "Taxes", es: "Impuestos" }, route: "/services" },
          { label: { en: "Translation", es: "Traducción" }, route: "/services" },
          { label: { en: "Money Transfer", es: "Transferencias" }, route: "/services" },
          { label: { en: "Notary", es: "Notaría" }, route: "/services" },
        ];

  const hours =
    content.office?.hours?.[language] ||
    (language === "es"
      ? [
          "Lunes-Viernes: 9:00 AM - 6:00 PM",
          "Sábado: 9:00 AM - 3:00 PM",
          "Domingo: Cerrado",
        ]
      : [
          "Monday-Friday: 9:00 AM - 6:00 PM",
          "Saturday: 9:00 AM - 3:00 PM",
          "Sunday: Closed",
        ]);

  const address = tText(
    content.office?.address,
    language,
    "2740 Dodds Ave, Chattanooga, TN"
  );

  const directionsLabel = tText(
    content.office?.directionsLabel,
    language,
    language === "es" ? "CÓMO LLEGAR" : "GET DIRECTIONS"
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={language === "es" ? "Inicio" : "Home"} />

      <ScreenShell>
        <View style={{ gap: 16, paddingBottom: 120 }}>
          <HomeHeaderCarousel slides={slides} />

          <OfficeCard
            hours={hours}
            address={address}
            directionsLabel={directionsLabel}
          />

          <PromoBanner />

          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 26,
              padding: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 24,
                fontWeight: "900",
                marginBottom: 18,
              }}
            >
              {language === "es" ? "Accesos Rápidos" : "Quick Actions"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                rowGap: 14,
              }}
            >
              {quickActions.map((item) => (
                <QuickActionItem
                  key={tText(item.label, language)}
                  label={tText(item.label, language)}
                  onPress={() => router.push((item.route || "/services") as any)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScreenShell>

      <BottomTabs active="home" />
    </View>
  );
}