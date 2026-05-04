import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_KEY = "servicios.requestDraft.v1";
const PENDING_KEY = "servicios.pendingRequests.v1";
const LAST_SERVICE_KEY = "servicios.lastService.v1";

export type RequestAttachment = {
  id: string;
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
  kind: "image" | "document";
};

export type ServiceRequestPayload = {
  service: string;
  name: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email";
  message: string;
  language: "en" | "es";
  attachments: RequestAttachment[];
  wantsNotifications?: boolean;
  pushToken?: string | null;
  createdAt: string;
};

export class ServiceRequestError extends Error {
  constructor(
    message: string,
    public code: "MISSING_ENDPOINT" | "OFFLINE" | "HTTP" | "NETWORK"
  ) {
    super(message);
    this.name = "ServiceRequestError";
  }
}

function getEndpoint() {
  return process.env.EXPO_PUBLIC_SERVICE_REQUEST_ENDPOINT?.trim();
}

export async function loadRequestDraft() {
  const raw = await AsyncStorage.getItem(DRAFT_KEY);
  return raw ? (JSON.parse(raw) as Partial<ServiceRequestPayload>) : null;
}

export function saveRequestDraft(draft: Partial<ServiceRequestPayload>) {
  return AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearRequestDraft() {
  return AsyncStorage.removeItem(DRAFT_KEY);
}

export async function getPendingRequests() {
  const raw = await AsyncStorage.getItem(PENDING_KEY);
  return raw ? (JSON.parse(raw) as ServiceRequestPayload[]) : [];
}

export async function enqueuePendingRequest(payload: ServiceRequestPayload) {
  const pending = await getPendingRequests();
  const next = [payload, ...pending].slice(0, 10);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(next));
  return next;
}

export async function replacePendingRequests(requests: ServiceRequestPayload[]) {
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(requests));
}

export async function getLastRequestedService() {
  return AsyncStorage.getItem(LAST_SERVICE_KEY);
}

export async function saveLastRequestedService(service: string) {
  await AsyncStorage.setItem(LAST_SERVICE_KEY, service);
}

export async function submitServiceRequest(
  payload: ServiceRequestPayload,
  isOnline: boolean | null
) {
  const endpoint = getEndpoint();

  if (!endpoint) {
    throw new ServiceRequestError(
      "Service request endpoint is not configured.",
      "MISSING_ENDPOINT"
    );
  }

  if (isOnline === false) {
    throw new ServiceRequestError("The device is offline.", "OFFLINE");
  }

  const body = new FormData();
  body.append("service", payload.service);
  body.append("name", payload.name);
  body.append("phone", payload.phone);
  body.append("email", payload.email);
  body.append("preferredContact", payload.preferredContact);
  body.append("message", payload.message);
  body.append("language", payload.language);
  body.append("createdAt", payload.createdAt);
  if (payload.pushToken) body.append("pushToken", payload.pushToken);

  payload.attachments.forEach((attachment, index) => {
    body.append("attachments", {
      uri: attachment.uri,
      name: attachment.name || `attachment-${index + 1}`,
      type: attachment.mimeType || "application/octet-stream",
    } as unknown as Blob);
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new ServiceRequestError(
        `Service request failed with status ${response.status}.`,
        "HTTP"
      );
    }
  } catch (error) {
    if (error instanceof ServiceRequestError) throw error;

    throw new ServiceRequestError(
      error instanceof Error ? error.message : "Network request failed.",
      "NETWORK"
    );
  }
}
