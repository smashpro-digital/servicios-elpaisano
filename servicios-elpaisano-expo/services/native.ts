import { Alert, Linking, Platform, Share } from "react-native";
import {
  EMAIL_ADDRESS,
  OFFICE_ADDRESS,
  PHONE_NUMBER,
  WEBSITE_BASE_URL,
} from "../data/website";

export async function openExternalUrl(url: string, fallbackMessage: string) {
  try {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Unable to open", fallbackMessage);
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert("Unable to open", fallbackMessage);
    return false;
  }
}

export function callPhoneNumber(phone: string) {
  return openExternalUrl(
    `tel:${phone.replace(/[^\d+]/g, "")}`,
    "This device cannot start a phone call."
  );
}

export function emailAddress(email: string, subject?: string, body?: string) {
  const params = new URLSearchParams();

  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);

  const query = params.toString();

  return openExternalUrl(
    `mailto:${email}${query ? `?${query}` : ""}`,
    "This device cannot open an email app."
  );
}

export function openDirections(address: string) {
  const encodedAddress = encodeURIComponent(address);
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?daddr=${encodedAddress}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return openExternalUrl(url, "This device cannot open maps.");
}

export function shareBusiness(language: "en" | "es" = "en") {
  const message =
    language === "es"
      ? `Servicios El Paisano\n${PHONE_NUMBER}\n${EMAIL_ADDRESS}\n${OFFICE_ADDRESS}\n${WEBSITE_BASE_URL}`
      : `Servicios El Paisano\n${PHONE_NUMBER}\n${EMAIL_ADDRESS}\n${OFFICE_ADDRESS}\n${WEBSITE_BASE_URL}`;

  return Share.share({
    title: "Servicios El Paisano",
    message,
    url: WEBSITE_BASE_URL,
  });
}

export async function addBusinessToContacts(language: "en" | "es" = "en") {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Servicios El Paisano",
    "ORG:Servicios El Paisano",
    `TEL;TYPE=WORK,VOICE:${PHONE_NUMBER}`,
    `EMAIL;TYPE=WORK:${EMAIL_ADDRESS}`,
    `ADR;TYPE=WORK:;;${OFFICE_ADDRESS.replace(/,/g, "\\,")};;;;`,
    `URL:${WEBSITE_BASE_URL}`,
    "END:VCARD",
  ].join("\n");

  const encoded = encodeURIComponent(vcard);
  try {
    await Linking.openURL(`data:text/vcard;charset=utf-8,${encoded}`);
  } catch {
    await Share.share({
      title: "Servicios El Paisano",
      message:
        language === "es"
          ? `Agregue Servicios El Paisano a sus contactos:\n\n${vcard}`
          : `Add Servicios El Paisano to your contacts:\n\n${vcard}`,
    });
  }
}

function nextBusinessMorning() {
  const next = new Date();
  next.setHours(9, 0, 0, 0);

  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }

  while (next.getDay() === 0) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

export function addVisitReminder(language: "en" | "es" = "en") {
  const start = nextBusinessMorning();
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);
  const format = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const title = encodeURIComponent(
    language === "es" ? "Visitar Servicios El Paisano" : "Visit Servicios El Paisano"
  );
  const details = encodeURIComponent(
    language === "es"
      ? "Recordatorio para visitar o llamar a la oficina."
      : "Reminder to visit or call the office."
  );
  const location = encodeURIComponent(OFFICE_ADDRESS);

  return openExternalUrl(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(
      start
    )}/${format(end)}&details=${details}&location=${location}`,
    "This device cannot open calendar."
  );
}
