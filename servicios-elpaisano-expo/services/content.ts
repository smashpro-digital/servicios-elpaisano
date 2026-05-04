import AsyncStorage from "@react-native-async-storage/async-storage";
import bundledSiteContent from "../data/site-content.json";
import {
  ABOUT_COPY,
  CONSULATE_LINKS,
  EMAIL_ADDRESS,
  FAX_NUMBER,
  GOOGLE_MAPS_URL,
  OFFICE_ADDRESS,
  PHONE_NUMBER,
  PRIVACY_URL,
  SERVICE_CHECKLISTS,
  SOCIAL_LINKS,
  WEBSITE_BASE_URL,
  WEBSITE_IMAGE_URLS,
  WEBSITE_SERVICES,
  YOUTUBE_VIDEO_URL,
} from "../data/website";

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

export type LinkItem = {
  label: string;
  url: string;
};

export type ServiceContentItem = {
  category: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  checklist?: {
    en: string[];
    es: string[];
  };
};

export type SiteContent = {
  version?: string;
  updatedAt?: string;
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
    fax?: string;
    email?: string;
    directionsLabel?: LocalizedText;
    mapsUrl?: string;
  };
  about?: {
    title?: LocalizedText;
    body?: LocalizedText;
    founders?: { name: string; imageSrc: string }[];
  };
  services?: ServiceContentItem[];
  links?: {
    couponUrl?: string;
    privacyUrl?: string;
    youtubeVideoUrl?: string;
    social?: LinkItem[];
    consulates?: LinkItem[];
  };
  images?: Record<string, string>;
};

export type SiteContentSource = "bundled" | "cache" | "remote";

export type SiteContentResult = {
  content: SiteContent;
  source: SiteContentSource;
  updatedAt?: string;
};

const CACHE_KEY = "servicios.siteContent.v1";
const CACHE_META_KEY = "servicios.siteContentMeta.v1";
const DEFAULT_CONTENT_URL = `${WEBSITE_BASE_URL}/app-content.json`;
const SITE_CONTENT_URL =
  process.env.EXPO_PUBLIC_SITE_CONTENT_URL?.trim() || DEFAULT_CONTENT_URL;

const fallbackContent: SiteContent = {
  ...(bundledSiteContent as SiteContent),
  about: {
    title: {
      en: "About Servicios El Paisano",
      es: "Acerca de Servicios El Paisano",
    },
    body: ABOUT_COPY,
    founders: [
      { name: "Santos Chavez", imageSrc: WEBSITE_IMAGE_URLS.santos },
      { name: "Carmen Hernandez", imageSrc: WEBSITE_IMAGE_URLS.carmen },
    ],
  },
  services: WEBSITE_SERVICES.map((service) => ({
    ...service,
    checklist:
      SERVICE_CHECKLISTS[service.title.en] || SERVICE_CHECKLISTS.default,
  })),
  links: {
    couponUrl: `${WEBSITE_BASE_URL}/coupon-d'anniversaire.docx`,
    privacyUrl: PRIVACY_URL,
    youtubeVideoUrl: YOUTUBE_VIDEO_URL,
    social: SOCIAL_LINKS,
    consulates: CONSULATE_LINKS,
  },
  office: {
    ...(bundledSiteContent as SiteContent).office,
    address:
      (bundledSiteContent as SiteContent).office?.address || localized(OFFICE_ADDRESS),
    phone: (bundledSiteContent as SiteContent).office?.phone || PHONE_NUMBER,
    fax: (bundledSiteContent as SiteContent).office?.fax || FAX_NUMBER,
    email: (bundledSiteContent as SiteContent).office?.email || EMAIL_ADDRESS,
    mapsUrl: GOOGLE_MAPS_URL,
  },
  images: WEBSITE_IMAGE_URLS,
};

function localized(value: string): LocalizedText {
  return { en: value, es: value };
}

function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object") return false;
  const maybe = value as Partial<LocalizedText>;
  return typeof maybe.en === "string" && typeof maybe.es === "string";
}

function hasUsableContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const content = value as SiteContent;
  const hasSlides = Array.isArray(content.home?.slides);
  const hasOffice = !!content.office;
  const hasServices = Array.isArray(content.services);
  return hasSlides || hasOffice || hasServices;
}

function mergeContent(content: SiteContent): SiteContent {
  return {
    ...fallbackContent,
    ...content,
    home: {
      ...fallbackContent.home,
      ...content.home,
      promo: {
        ...fallbackContent.home?.promo,
        ...content.home?.promo,
      },
    },
    office: {
      ...fallbackContent.office,
      ...content.office,
    },
    about: {
      ...fallbackContent.about,
      ...content.about,
    },
    links: {
      ...fallbackContent.links,
      ...content.links,
    },
    images: {
      ...fallbackContent.images,
      ...content.images,
    },
    services: content.services?.length ? content.services : fallbackContent.services,
    quickActions: content.quickActions?.length
      ? content.quickActions
      : fallbackContent.quickActions,
  };
}

async function readCachedContent(): Promise<SiteContentResult | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  const parsed = JSON.parse(raw) as unknown;
  if (!hasUsableContent(parsed)) return null;

  const metaRaw = await AsyncStorage.getItem(CACHE_META_KEY);
  const meta = metaRaw ? (JSON.parse(metaRaw) as { updatedAt?: string }) : {};

  return {
    content: mergeContent(parsed),
    source: "cache",
    updatedAt: meta.updatedAt,
  };
}

export function getBundledSiteContent(): SiteContentResult {
  return {
    content: mergeContent(fallbackContent),
    source: "bundled",
    updatedAt: fallbackContent.updatedAt,
  };
}

export async function getCachedSiteContent() {
  return (await readCachedContent()) || getBundledSiteContent();
}

export async function fetchRemoteSiteContent(signal?: AbortSignal) {
  const response = await fetch(SITE_CONTENT_URL, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Site content request failed with ${response.status}.`);
  }

  const parsed = (await response.json()) as unknown;

  if (!hasUsableContent(parsed)) {
    throw new Error("Site content response did not match the app schema.");
  }

  const content = mergeContent(parsed);
  const updatedAt = content.updatedAt || new Date().toISOString();

  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(content));
  await AsyncStorage.setItem(CACHE_META_KEY, JSON.stringify({ updatedAt }));

  return {
    content,
    source: "remote" as const,
    updatedAt,
  };
}

export function getSiteContentUrl() {
  return SITE_CONTENT_URL;
}

export function tText(
  value: LocalizedText | string | undefined,
  language: Language,
  fallback = ""
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (!isLocalizedText(value)) return fallback;
  return value[language] || value.en || value.es || fallback;
}
