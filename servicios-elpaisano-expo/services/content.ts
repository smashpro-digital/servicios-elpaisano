import siteContent from "../data/site-content.json";

export type Language = "en" | "es";

export type LocalizedText = {
  en: string;
  es: string;
};

export type SlideItem = {
  id: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  imageSrc?: string;
  eyebrow?: LocalizedText;
};

export type QuickActionItem = {
  label: LocalizedText;
  route?: string;
};

export type SiteContent = {
  home?: {
    slides?: SlideItem[];
    promo?: {
      badge?: LocalizedText;
      title?: LocalizedText;
      subtitle?: LocalizedText;
      buttonLabel?: LocalizedText;
    };
  };
  quickActions?: QuickActionItem[];
  office?: {
    title?: LocalizedText;
    hoursTitle?: LocalizedText;
    addressTitle?: LocalizedText;
    hours?: {
      en: string[];
      es: string[];
    };
    address?: LocalizedText;
    phone?: string;
    email?: string;
    directionsLabel?: LocalizedText;
  };
};

export function getSiteContent(): SiteContent {
  return siteContent as SiteContent;
}

export function tText(
  value: LocalizedText | string | undefined,
  language: Language,
  fallback = ""
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[language] || value.en || value.es || fallback;
}