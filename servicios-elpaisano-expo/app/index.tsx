import { useEffect, useMemo, useRef, useState } from "react";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { AppHeader, BottomTabs, ScreenShell } from "../components/Shell";
import {
  COUPON_URL,
  GOOGLE_MAPS_URL,
  OFFICE_ADDRESS,
  PHONE_NUMBER,
  WEBSITE_SERVICES,
  YOUTUBE_VIDEO_URL,
} from "../data/website";
import { useSiteContent } from "../hooks/useSiteContent";
import { useLanguage } from "../hooks/useLanguage";
import { tText } from "../services/content";
import {
  callPhoneNumber,
  openDirections,
  openExternalUrl,
  shareBusiness,
} from "../services/native";
import { getOfficeStatus } from "../services/officeHours";
import { getLastRequestedService } from "../services/serviceRequests";

const COLORS = {
  bg: "#edf1f6",
  navy: "#143b73",
  navySoft: "#1f4f95",
  navyDark: "#0d2f57",
  text: "#17345c",
  textSoft: "#5b6f8f",
  white: "#ffffff",
  yellow: "#d7b45f",
  yellowSoft: "#f5e5b8",
  card: "#ffffff",
  quickBg: "#f6f8fb",
  border: "#d8e0ec",
  dot: "#c3cee1",
};

const LOCAL_SLIDE_FALLBACKS: ImageSourcePropType[] = [
  require("../assets/slides/office.jpg"),
  require("../assets/slides/taxes.jpg"),
  require("../assets/slides/services.jpg"),
  require("../assets/slides/community.jpg"),
];
const APP_ICON = require("../assets/images/icon.png");

type SlideItem = {
  id: string;
  title: { en: string; es: string };
  subtitle?: { en: string; es: string };
  imageSrc?: string;
  eyebrow?: { en: string; es: string };
};

const QUICK_ACTION_SERVICE_TARGETS: Record<string, string> = {
  taxes: "Tax preparation and e-filing",
  impuestos: "Tax preparation and e-filing",
  translation: "Translation",
  traduccion: "Translation",
  moneytransfer: "Money transfers",
  transferencias: "Money transfers",
  notary: "Notary",
  notaria: "Notary",
  passports: "Passports and passport photos",
  pasaportes: "Passports and passport photos",
  billpay: "Bill pay",
  pagodefacturas: "Bill pay",
};

function normalizeQuickAction(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function requestService(service?: string, language?: "en" | "es") {
  router.push({
    pathname: "/request",
    params: {
      ...(service ? { service } : {}),
      ...(language ? { lang: language } : {}),
    },
  });
}

function openQuickAction(
  route: string | undefined,
  label: string,
  language: "en" | "es"
) {
  const nextRoute = route || "/services";

  if (nextRoute === "/services") {
    const target = QUICK_ACTION_SERVICE_TARGETS[normalizeQuickAction(label)];

    router.push({
      pathname: "/services",
      params: {
        ...(target ? { target } : {}),
        lang: language,
      },
    } as any);
    return;
  }

  router.push(nextRoute as any);
}

function getLocalFallback(index: number): ImageSourcePropType {
  return LOCAL_SLIDE_FALLBACKS[index % LOCAL_SLIDE_FALLBACKS.length];
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || null;
}

function HeroBrandBadge() {
  return (
    <View
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 2,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Image
        source={APP_ICON}
        resizeMode="contain"
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.92)",
        }}
      />
      <View
        style={{
          backgroundColor: "rgba(13,47,87,0.84)",
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: "900" }}>
          SERVICIOS EL PAISANO
        </Text>
        <Text style={{ color: COLORS.yellowSoft, fontSize: 11, fontWeight: "700" }}>
          Chattanooga, TN
        </Text>
      </View>
    </View>
  );
}

function HomeSlide({
  slide,
  index,
  failedRemoteSlides,
  setFailedRemoteSlides,
  slideWidth,
  phone,
}: {
  slide: SlideItem;
  index: number;
  slideWidth: number;
  phone: string;
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
        width: slideWidth,
        borderRadius: 26,
        overflow: "hidden",
        backgroundColor: COLORS.navyDark,
      }}
    >
      <ImageBackground
        source={source}
        resizeMode="cover"
        onError={() => {
          if (useRemote) {
            setFailedRemoteSlides((prev) => ({ ...prev, [slide.id]: true }));
          }
        }}
        style={{
          height: 390,
          justifyContent: "flex-end",
        }}
      >
        <HeroBrandBadge />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(7,22,42,0.44)" },
          ]}
        />

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 112,
            paddingBottom: 22,
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <Text
            style={{
              color: COLORS.yellowSoft,
              fontSize: 12,
              fontWeight: "900",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {tText(slide.eyebrow, language, "Multiple Services")}
          </Text>

          <Text
            style={{
              color: COLORS.white,
              fontSize: 29,
              lineHeight: 34,
              fontWeight: "900",
              marginBottom: 10,
            }}
          >
            {tText(slide.title, language)}
          </Text>

          <Text
            style={{
              color: "#eef4ff",
              fontSize: 15,
              lineHeight: 23,
              marginBottom: 18,
            }}
          >
            {tText(
              slide.subtitle,
              language,
              language === "es"
                ? "Sirviendo a la comunidad de Chattanooga por mas de 20 anos."
                : "Serving the Chattanooga community for over 20 years."
            )}
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={() => requestService(undefined, language)}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: COLORS.yellow,
                borderRadius: 16,
                paddingVertical: 15,
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
                {language === "es" ? "Solicitar" : "Request"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => callPhoneNumber(phone)}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.92)",
                borderRadius: 16,
                paddingVertical: 15,
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
      </ImageBackground>
    </View>
  );
}

function HomeHeaderCarousel({
  slides,
  phone,
}: {
  slides: SlideItem[];
  phone: string;
}) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedRemoteSlides, setFailedRemoteSlides] = useState<Record<string, boolean>>({});
  const slideWidth = useMemo(() => Math.max(width - 40, 280), [width]);

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
            slideWidth={slideWidth}
            phone={phone}
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
  const officeStatus = getOfficeStatus(language);

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
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: officeStatus.isOpen ? "#e4f6ea" : "#fff2d7",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: officeStatus.isOpen ? "#26693b" : "#7a4b00",
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              {officeStatus.label} - {officeStatus.detail}
            </Text>
          </View>
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
        onPress={() =>
          openExternalUrl(GOOGLE_MAPS_URL, "This device cannot open Google Maps.")
        }
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
          {language === "es" ? "20 ANOS" : "20 YEAR"}
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
            ? "20 anos sirviendo a la comunidad!"
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
          {language === "es" ? "CELEBRANDO" : "CELEBRATING"}
        </Text>
        <Text
          style={{
            color: "#eaf1ff",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {language === "es"
            ? "Descarga el cupon para ahorrar en servicios hoy."
            : "Download coupon to save on services today!"}
        </Text>
        <Pressable
          onPress={() =>
            openExternalUrl(COUPON_URL, "This device cannot open the coupon.")
          }
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            backgroundColor: COLORS.white,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginTop: 12,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <Text
            style={{
              color: COLORS.navyDark,
              fontSize: 14,
              fontWeight: "900",
            }}
          >
            {language === "es" ? "Obtener Cupon" : "Get Coupon"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function YouTubeCard({ url }: { url: string }) {
  const { language } = useLanguage();
  const videoId = getYouTubeId(url);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : undefined;

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 22,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      {thumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          resizeMode="cover"
          style={{ width: "100%", height: 190, backgroundColor: "#e8edf4" }}
        />
      ) : null}
      <View style={{ padding: 16, gap: 10 }}>
        <Text
          style={{
            color: COLORS.text,
            fontSize: 20,
            fontWeight: "900",
          }}
        >
          {language === "es" ? "Video de YouTube" : "YouTube Video"}
        </Text>
        <Text style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 20 }}>
          {language === "es"
            ? "Vea el video enlazado desde el sitio web de Servicios El Paisano."
            : "Watch the video linked from the Servicios El Paisano website."}
        </Text>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/video",
              params: { url },
            })
          }
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            backgroundColor: COLORS.navyDark,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 11,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: "900" }}>
            {language === "es" ? "Ver Video" : "Watch Video"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ServicesPreview() {
  const { language } = useLanguage();
  const previewServices = WEBSITE_SERVICES.slice(0, 4);

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 26,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 24,
              fontWeight: "900",
              marginBottom: 4,
            }}
          >
            {language === "es" ? "Servicios Populares" : "Popular Services"}
          </Text>
          <Text style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 20 }}>
            {language === "es"
              ? "Documentos, impuestos, telefonos y mas en un solo lugar."
              : "Documents, taxes, phones, and more in one place."}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/services")}
          style={({ pressed }) => ({
            backgroundColor: COLORS.navyDark,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 11,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: "900" }}>
            {language === "es" ? "Ver Todo" : "View All"}
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        {previewServices.map((service) => (
          <Pressable
            key={service.title.en}
            onPress={() => requestService(service.title.en, language)}
            style={({ pressed }) => ({
              backgroundColor: COLORS.quickBg,
              borderRadius: 18,
              padding: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 16,
                fontWeight: "900",
                marginBottom: 4,
              }}
            >
              {service.title[language]}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                color: COLORS.textSoft,
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              {service.subtitle[language]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RecentServiceCard({ service }: { service: string | null }) {
  const { language } = useLanguage();
  const matched = WEBSITE_SERVICES.find((item) => item.title.en === service);

  if (!matched) return null;

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
      <Text
        style={{
          color: COLORS.text,
          fontSize: 18,
          fontWeight: "900",
          marginBottom: 4,
        }}
      >
        {language === "es" ? "Solicitar otra vez" : "Request again"}
      </Text>
      <Text style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 20 }}>
        {matched.title[language]}
      </Text>
      <Pressable
        onPress={() => requestService(matched.title.en, language)}
        style={({ pressed }) => ({
          alignSelf: "flex-start",
          backgroundColor: COLORS.yellow,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginTop: 12,
          opacity: pressed ? 0.92 : 1,
        })}
      >
        <Text style={{ color: COLORS.navyDark, fontSize: 14, fontWeight: "900" }}>
          {language === "es" ? "Abrir Solicitud" : "Open Request"}
        </Text>
      </Pressable>
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
        minHeight: 92,
        backgroundColor: COLORS.quickBg,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 16,
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
          fontSize: 16,
          fontWeight: "900",
          lineHeight: 22,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function Index() {
  const { content } = useSiteContent();
  const { language } = useLanguage();
  const [lastService, setLastService] = useState<string | null>(null);

  useEffect(() => {
    getLastRequestedService()
      .then(setLastService)
      .catch(() => {});
  }, []);

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
    "3501 Rossville Blvd, Chattanooga, TN 37407"
  );
  const phone = content.office?.phone || PHONE_NUMBER;

  const directionsLabel = tText(
    content.office?.directionsLabel,
    language,
    language === "es" ? "CÓMO LLEGAR" : "GET DIRECTIONS"
  );
  const youtubeVideoUrl = content.links?.youtubeVideoUrl || YOUTUBE_VIDEO_URL;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={language === "es" ? "Inicio" : "Home"} />

      <ScreenShell>
        <View style={{ gap: 16, paddingBottom: 120 }}>
          <HomeHeaderCarousel slides={slides} phone={phone} />

          <RecentServiceCard service={lastService} />

          <OfficeCard
            hours={hours}
            address={address}
            directionsLabel={directionsLabel}
          />

          <ServicesPreview />

          <YouTubeCard url={youtubeVideoUrl} />

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
                  onPress={() =>
                    openQuickAction(
                      item.route,
                      tText(item.label, language),
                      language
                    )
                  }
                />
              ))}
              <QuickActionItem
                label={language === "es" ? "Compartir App" : "Share App"}
                onPress={() => shareBusiness(language)}
              />
              <QuickActionItem
                label={language === "es" ? "Abrir Ruta" : "Open Directions"}
                onPress={() => openDirections(OFFICE_ADDRESS)}
              />
            </View>
          </View>
        </View>
      </ScreenShell>

      <BottomTabs active="home" />
      <Pressable
        onPress={() => callPhoneNumber(phone)}
        style={({ pressed }) => ({
          position: "absolute",
          right: 18,
          bottom: 98,
          backgroundColor: COLORS.yellow,
          borderRadius: 999,
          paddingHorizontal: 18,
          paddingVertical: 14,
          borderWidth: 1,
          borderColor: "rgba(13,47,87,0.12)",
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 5,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Text style={{ color: COLORS.navyDark, fontSize: 15, fontWeight: "900" }}>
          {language === "es" ? "Llamar" : "Call"}
        </Text>
      </Pressable>
    </View>
  );
}
