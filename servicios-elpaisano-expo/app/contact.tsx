import { Pressable, Text, View } from "react-native";
import {
  AppHeader,
  BottomTabs,
  ScreenShell,
} from "../components/Shell";
import {
  CONSULATE_LINKS,
  COUPON_URL,
  EMAIL_ADDRESS,
  FAX_NUMBER,
  GOOGLE_MAPS_URL,
  OFFICE_ADDRESS,
  PHONE_NUMBER,
  PRIVACY_URL,
  SOCIAL_LINKS,
} from "../data/website";
import {
  addBusinessToContacts,
  addVisitReminder,
  callPhoneNumber,
  emailAddress,
  openDirections,
  openExternalUrl,
  shareBusiness,
} from "../services/native";
import { useLanguage } from "../hooks/useLanguage";
import { useSiteContent } from "../hooks/useSiteContent";
import { tText } from "../services/content";

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
  onPress,
}: {
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
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
  const { language } = useLanguage();
  const { content } = useSiteContent();
  const phone = content.office?.phone || PHONE_NUMBER;
  const email = content.office?.email || EMAIL_ADDRESS;
  const fax = content.office?.fax || FAX_NUMBER;
  const address = tText(content.office?.address, language, OFFICE_ADDRESS);
  const mapsUrl = content.office?.mapsUrl || GOOGLE_MAPS_URL;
  const couponUrl = content.links?.couponUrl || COUPON_URL;
  const privacyUrl = content.links?.privacyUrl || PRIVACY_URL;
  const hours =
    content.office?.hours?.[language]?.join("\n") ||
    (language === "es"
      ? "Lunes-Viernes: 9:00 AM - 6:00 PM\nSabado: 9:00 AM - 3:00 PM\nDomingo: Cerrado"
      : "Monday-Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 3:00 PM\nSunday: Closed");
  const consulateLinks = content.links?.consulates?.length
    ? content.links.consulates
    : CONSULATE_LINKS;
  const socialLinks = content.links?.social?.length
    ? content.links.social
    : SOCIAL_LINKS;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={language === "es" ? "Contacto" : "Contact"} />

      <ScreenShell>
        <View style={{ gap: 18, paddingBottom: 120 }}>
          <Card title={language === "es" ? "Contactenos" : "Contact Us"}>
            <ActionButton
              label={language === "es" ? `Llamar ${phone}` : `Call ${phone}`}
              primary
              onPress={() => callPhoneNumber(phone)}
            />
            <ActionButton
              label={`Email ${email}`}
              onPress={() => emailAddress(email, "Service question")}
            />
            <ActionButton
              label={language === "es" ? "Como Llegar" : "Get Directions"}
              onPress={() => openDirections(address)}
            />
            <ActionButton
              label={language === "es" ? "Abrir Google Maps" : "Open Google Maps"}
              onPress={() =>
                openExternalUrl(mapsUrl, "This device cannot open Google Maps.")
              }
            />
            <ActionButton
              label={language === "es" ? "Descargar Cupon" : "Download Coupon"}
              onPress={() =>
                openExternalUrl(couponUrl, "This device cannot open the coupon.")
              }
            />
            <ActionButton
              label={language === "es" ? "Compartir Informacion" : "Share Info"}
              onPress={() => shareBusiness(language)}
            />
            <ActionButton
              label={language === "es" ? "Agregar a Contactos" : "Add to Contacts"}
              onPress={() => addBusinessToContacts(language)}
            />
            <ActionButton
              label={language === "es" ? "Crear Recordatorio" : "Create Reminder"}
              onPress={() => addVisitReminder(language)}
            />

            <View
              style={{
                height: 1,
                backgroundColor: COLORS.border,
                marginVertical: 8,
              }}
            />

            <InfoRow
              title="Office"
              body={address}
            />
            <InfoRow title={language === "es" ? "Telefono" : "Phone"} body={phone} />
            <InfoRow title="Fax" body={fax} />
            <InfoRow
              title={language === "es" ? "Horario" : "Hours"}
              body={hours}
            />
            <InfoRow
              title={language === "es" ? "Idiomas" : "Languages"}
              body={language === "es" ? "Ingles y espanol" : "English and Spanish"}
            />
          </Card>

          <Card title={language === "es" ? "Consulados" : "Consulates"}>
            {consulateLinks.map((link) => (
              <ActionButton
                key={link.label}
                label={link.label}
                onPress={() =>
                  openExternalUrl(link.url, `This device cannot open ${link.label}.`)
                }
              />
            ))}
          </Card>

          <Card title={language === "es" ? "Privacidad y Datos" : "Privacy & Data"}>
            <Text
              selectable
              style={{
                color: COLORS.textSoft,
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 14,
              }}
            >
              {language === "es"
                ? "La app usa los datos que usted escribe en una solicitud de servicio para contactar a la oficina. Las fotos o documentos se agregan solo cuando usted los selecciona. La camara se usa solo si toma una foto. Las notificaciones son opcionales para avisos de seguimiento."
                : "The app uses the details you enter in a service request to contact the office. Photos or documents are attached only when you select them. The camera is used only when you take a photo. Notifications are optional for request follow-up alerts."}
            </Text>
            <ActionButton
              label={language === "es" ? "Abrir Politica de Privacidad" : "Open Privacy Policy"}
              onPress={() =>
                openExternalUrl(privacyUrl, "This device cannot open privacy information.")
              }
            />
          </Card>

          <Card title={language === "es" ? "Redes y Privacidad" : "Stay Connected"}>
            <Text
              style={{
                color: COLORS.textSoft,
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 14,
              }}
            >
              {language === "es"
                ? "Abre los perfiles sociales del sitio web o revisa la informacion de privacidad."
                : "Follow the website social profiles or review privacy information."}
            </Text>

            {socialLinks.map((link) => (
              <ActionButton
                key={link.label}
                label={link.label}
                onPress={() =>
                  openExternalUrl(link.url, `This device cannot open ${link.label}.`)
                }
              />
            ))}
          </Card>
        </View>
      </ScreenShell>

      <BottomTabs active="contact" />
    </View>
  );
}
