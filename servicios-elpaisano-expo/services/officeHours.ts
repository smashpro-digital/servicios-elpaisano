import { OFFICE_HOURS } from "../data/website";

export function getOfficeStatus(language: "en" | "es", now = new Date()) {
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const hours =
    day >= 1 && day <= 5
      ? OFFICE_HOURS.weekday
      : day === 6
        ? OFFICE_HOURS.saturday
        : null;

  if (hours && hour >= hours.open && hour < hours.close) {
    return {
      isOpen: true,
      label: language === "es" ? "Abierto ahora" : "Open now",
      detail:
        language === "es"
          ? `Cierra a las ${hours.close > 12 ? hours.close - 12 : hours.close}:00 PM`
          : `Closes at ${hours.close > 12 ? hours.close - 12 : hours.close}:00 PM`,
    };
  }

  return {
    isOpen: false,
    label: language === "es" ? "Cerrado ahora" : "Closed now",
    detail:
      language === "es"
        ? "Abre el proximo dia habil a las 9:00 AM"
        : "Opens next business day at 9:00 AM",
  };
}
