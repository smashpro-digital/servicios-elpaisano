import { useNetInfo } from "@react-native-community/netinfo";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppHeader, BottomTabs, ScreenShell } from "../components/Shell";
import { SERVICE_CHECKLISTS, WEBSITE_SERVICES } from "../data/website";
import { useLanguage } from "../hooks/useLanguage";
import { useSiteContent } from "../hooks/useSiteContent";
import { ServiceContentItem } from "../services/content";
import { emailAddress } from "../services/native";
import { registerForPushNotifications } from "../services/notifications";
import {
  clearRequestDraft,
  enqueuePendingRequest,
  getPendingRequests,
  getLastRequestedService,
  loadRequestDraft,
  replacePendingRequests,
  RequestAttachment,
  saveLastRequestedService,
  saveRequestDraft,
  ServiceRequestError,
  ServiceRequestPayload,
  submitServiceRequest,
} from "../services/serviceRequests";

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
  danger: "#9f2f2f",
};

const DEFAULT_SERVICE = WEBSITE_SERVICES[0].title.en;

const CONTACT_EMAIL = "servicioselpaisano@gmail.com";

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "800" }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8ca0bd"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={{
          minHeight: multiline ? 118 : 56,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.white,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 14 : 0,
          color: COLORS.text,
          fontSize: 16,
          lineHeight: 22,
        }}
      />
    </View>
  );
}

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: active ? "#dce9ff" : "#f6f8fc",
        borderWidth: 1,
        borderColor: active ? "#bfd4fb" : COLORS.border,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Text
        style={{
          color: active ? COLORS.navyDark : COLORS.text,
          fontSize: 14,
          fontWeight: active ? "900" : "700",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ActionButton({
  label,
  onPress,
  primary = false,
  disabled = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        minHeight: 54,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: primary ? COLORS.yellow : COLORS.white,
        borderWidth: primary ? 0 : 1,
        borderColor: COLORS.border,
        opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.navyDark} />
      ) : (
        <Text
          style={{
            color: COLORS.navyDark,
            fontSize: 16,
            fontWeight: "900",
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function attachmentNameFromUri(uri: string) {
  const name = uri.split("/").pop();
  return name && name.includes(".") ? name : `photo-${Date.now()}.jpg`;
}

export default function RequestScreen() {
  const params = useLocalSearchParams<{ service?: string; lang?: string }>();
  const { language, setLanguage } = useLanguage();
  const { content } = useSiteContent();
  const netInfo = useNetInfo();
  const [service, setService] = useState(DEFAULT_SERVICE);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredContact, setPreferredContact] = useState<"phone" | "email">(
    "phone"
  );
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<RequestAttachment[]>([]);
  const [wantsNotifications, setWantsNotifications] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const title = language === "es" ? "Solicitar Servicio" : "Request Service";
  const isOnline = netInfo.isConnected;
  const canSubmit = name.trim() && (phone.trim() || email.trim());
  const availableServices: ServiceContentItem[] = content.services?.length
    ? content.services
    : WEBSITE_SERVICES.map((item) => ({
        ...item,
        checklist: SERVICE_CHECKLISTS[item.title.en] || SERVICE_CHECKLISTS.default,
      }));
  const serviceOptions = availableServices.map((item) => ({
    value: item.title.en,
    label: item.title[language],
  }));
  const selectedService = availableServices.find(
    (item) => item.title.en === service
  );
  const checklist =
    selectedService?.checklist ||
    SERVICE_CHECKLISTS[service] ||
    SERVICE_CHECKLISTS.default;

  const draft = useMemo(
    () => ({
      service,
      name,
      phone,
      email,
      preferredContact,
      message,
      language,
      attachments,
      wantsNotifications,
    }),
    [
      attachments,
      email,
      language,
      message,
      name,
      phone,
      preferredContact,
      service,
      wantsNotifications,
    ]
  );

  const retryPendingRequests = useCallback(
    async ({
      silent = false,
      isMounted = true,
    }: {
      silent?: boolean;
      isMounted?: boolean;
    } = {}) => {
      const pending = await getPendingRequests();
      setPendingCount(pending.length);
      if (!pending.length) {
        if (!silent) setNotice("There are no saved requests to retry.");
        return;
      }

      const remaining: ServiceRequestPayload[] = [];

      for (const request of pending) {
        try {
          await submitServiceRequest(request, true);
        } catch {
          remaining.push(request);
        }
      }

      await replacePendingRequests(remaining);

      if (isMounted) {
        setPendingCount(remaining.length);
        setNotice(
          remaining.length
            ? "Some saved requests were sent. A few are still pending."
            : "Saved requests were sent."
        );
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    loadRequestDraft()
      .then((storedDraft) => {
        if (!storedDraft || !isMounted) return;
        if (storedDraft.service) setService(storedDraft.service);
        if (storedDraft.name) setName(storedDraft.name);
        if (storedDraft.phone) setPhone(storedDraft.phone);
        if (storedDraft.email) setEmail(storedDraft.email);
        if (storedDraft.preferredContact) {
          setPreferredContact(storedDraft.preferredContact);
        }
        if (storedDraft.message) setMessage(storedDraft.message);
        if (storedDraft.attachments) setAttachments(storedDraft.attachments);
        if (typeof storedDraft.wantsNotifications === "boolean") {
          setWantsNotifications(storedDraft.wantsNotifications);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setDraftReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const paramLanguage = Array.isArray(params.lang) ? params.lang[0] : params.lang;
    if (paramLanguage === "en" || paramLanguage === "es") {
      setLanguage(paramLanguage);
    }
  }, [params.lang, setLanguage]);

  useEffect(() => {
    if (!draftReady) return;

    const requestedService = Array.isArray(params.service)
      ? params.service[0]
      : params.service;

    if (
      requestedService &&
      availableServices.some((item) => item.title.en === requestedService)
    ) {
      setService(requestedService);
      return;
    }

    getLastRequestedService()
      .then((lastService) => {
        if (
          lastService &&
          availableServices.some((item) => item.title.en === lastService)
        ) {
          setService((current) => current || lastService);
        }
      })
      .catch(() => {});
  }, [availableServices, draftReady, params.service]);

  useEffect(() => {
    getPendingRequests()
      .then((pending) => setPendingCount(pending.length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    saveRequestDraft(draft).catch(() => {});
  }, [draft, draftReady]);

  useEffect(() => {
    if (isOnline !== true) return;

    let isMounted = true;

    retryPendingRequests({ silent: true, isMounted }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isOnline, retryPendingRequests]);

  async function addPhoto(fromCamera: boolean) {
    if (fromCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to take a photo."
        );
        return;
      }
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 0.75,
        })
      : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          quality: 0.75,
          mediaTypes: "images",
        });

    if (result.canceled) return;

    const next = result.assets.map((asset) => ({
      id: `${asset.uri}-${Date.now()}`,
      name: asset.fileName || attachmentNameFromUri(asset.uri),
      uri: asset.uri,
      mimeType: asset.mimeType || "image/jpeg",
      size: asset.fileSize,
      kind: "image" as const,
    }));

    setAttachments((current) => [...current, ...next].slice(0, 6));
  }

  async function addDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      type: ["application/pdf", "image/*"],
    });

    if (result.canceled) return;

    const next = result.assets.map((asset) => ({
      id: `${asset.uri}-${Date.now()}`,
      name: asset.name,
      uri: asset.uri,
      mimeType: asset.mimeType,
      size: asset.size,
      kind: "document" as const,
    }));

    setAttachments((current) => [...current, ...next].slice(0, 6));
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((item) => item.id !== id));
  }

  function buildPayload(pushToken?: string | null): ServiceRequestPayload {
    return {
      ...draft,
      service,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      pushToken,
      createdAt: new Date().toISOString(),
    };
  }

  async function submit() {
    if (!canSubmit) {
      Alert.alert(
        "Missing details",
        "Please add your name and at least one contact method."
      );
      return;
    }

    setStatus("loading");
    setNotice(null);

    const push = wantsNotifications
      ? await registerForPushNotifications()
      : { token: null };
    const payload = buildPayload(push?.token ?? null);

    try {
      await submitServiceRequest(payload, isOnline);
      await saveLastRequestedService(payload.service);
      await clearRequestDraft();
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setAttachments([]);
      setNotice("Request sent. The office will follow up soon.");
    } catch (error) {
      if (error instanceof ServiceRequestError) {
        await enqueuePendingRequest(payload);
        await saveLastRequestedService(payload.service);
        setPendingCount((current) => Math.min(current + 1, 10));

        if (error.code === "MISSING_ENDPOINT") {
          await emailAddress(
            CONTACT_EMAIL,
            `Service request: ${payload.service}`,
            `${payload.name}\n${payload.phone}\n${payload.email}\n\n${payload.message}`
          );
          setNotice(
            "No request endpoint is configured, so an email draft was opened and the request was saved on this device."
          );
        } else {
          setNotice(
            "The request was saved on this device and can be retried when the connection is available."
          );
        }
      } else {
        setNotice("The request could not be sent. It was saved as a draft.");
      }
    } finally {
      setStatus("idle");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AppHeader title={title} />

      <ScreenShell>
        <View style={{ gap: 18, paddingBottom: 120 }}>
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 28,
              padding: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              gap: 18,
            }}
          >
            <View style={{ gap: 6 }}>
              <Text
                style={{ color: COLORS.text, fontSize: 24, fontWeight: "900" }}
              >
                {language === "es" ? "Detalles del Servicio" : "Service Details"}
              </Text>
              <Text style={{ color: COLORS.textSoft, fontSize: 15, lineHeight: 22 }}>
                {isOnline === false
                  ? "Offline mode: your request will be saved on this device."
                  : "Share the basics and attach any helpful documents."}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingRight: 8 }}
            >
              {serviceOptions.map((option) => (
                <Pill
                  key={option.value}
                  label={option.label}
                  active={service === option.value}
                  onPress={() => setService(option.value)}
                />
              ))}
            </ScrollView>

            <View
              style={{
                backgroundColor: "#f6f8fc",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: COLORS.border,
                padding: 14,
                gap: 8,
              }}
            >
              <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "900" }}>
                {language === "es"
                  ? "Lista recomendada"
                  : "Recommended checklist"}
              </Text>
              {checklist[language].map((item) => (
                <Text
                  key={item}
                  style={{ color: COLORS.textSoft, fontSize: 14, lineHeight: 20 }}
                >
                  - {item}
                </Text>
              ))}
            </View>

            <Field
              label={language === "es" ? "Nombre" : "Name"}
              value={name}
              onChangeText={setName}
              placeholder="Maria Garcia"
            />
            <Field
              label={language === "es" ? "Telefono" : "Phone"}
              value={phone}
              onChangeText={setPhone}
              placeholder="423-265-2528"
              keyboardType="phone-pad"
            />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
            />

            <View style={{ gap: 10 }}>
              <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "800" }}>
                {language === "es" ? "Contacto Preferido" : "Preferred Contact"}
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pill
                  label={language === "es" ? "Telefono" : "Phone"}
                  active={preferredContact === "phone"}
                  onPress={() => setPreferredContact("phone")}
                />
                <Pill
                  label="Email"
                  active={preferredContact === "email"}
                  onPress={() => setPreferredContact("email")}
                />
              </View>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 18,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 15,
                    fontWeight: "800",
                  }}
                >
                  {language === "es"
                    ? "Avisos de seguimiento"
                    : "Request follow-up alerts"}
                </Text>
                <Text style={{ color: COLORS.textSoft, fontSize: 13, lineHeight: 18 }}>
                  {language === "es"
                    ? "Opcional. Permite notificaciones solo para actualizaciones de esta solicitud."
                    : "Optional. Allows notifications only for updates about this request."}
                </Text>
              </View>
              <Switch
                value={wantsNotifications}
                onValueChange={setWantsNotifications}
                trackColor={{ false: "#dbe4f0", true: "#bfd4fb" }}
                thumbColor={wantsNotifications ? COLORS.yellow : COLORS.white}
              />
            </View>

            <Field
              label={language === "es" ? "Notas" : "Notes"}
              value={message}
              onChangeText={setMessage}
              placeholder={
                language === "es"
                  ? "Cuentele a la oficina que necesita."
                  : "Tell the office what you need."
              }
              multiline
            />

            <View style={{ gap: 10 }}>
              <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "800" }}>
                {language === "es" ? "Documentos" : "Documents"}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                <Pill label="Take Photo" active={false} onPress={() => addPhoto(true)} />
                <Pill label="Photo Library" active={false} onPress={() => addPhoto(false)} />
                <Pill label="File" active={false} onPress={addDocument} />
              </View>

              {attachments.map((attachment) => (
                <View
                  key={attachment.id}
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 16,
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{ color: COLORS.text, flex: 1, fontWeight: "700" }}
                  >
                    {attachment.name}
                  </Text>
                  <Pressable onPress={() => removeAttachment(attachment.id)}>
                    <Text style={{ color: COLORS.danger, fontWeight: "900" }}>
                      Remove
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {notice ? (
              <Text selectable style={{ color: COLORS.textSoft, lineHeight: 22 }}>
                {notice}
              </Text>
            ) : null}

            {pendingCount > 0 ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 18,
                  padding: 14,
                  gap: 10,
                  backgroundColor: "#fffaf0",
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "900" }}>
                  {language === "es"
                    ? `${pendingCount} solicitud guardada`
                    : `${pendingCount} saved request${pendingCount === 1 ? "" : "s"}`}
                </Text>
                <Text style={{ color: COLORS.textSoft, fontSize: 13, lineHeight: 18 }}>
                  {language === "es"
                    ? "Estas solicitudes estan guardadas en este dispositivo."
                    : "These requests are saved on this device."}
                </Text>
                <ActionButton
                  label={language === "es" ? "Reintentar Envio" : "Retry Sending"}
                  onPress={() => retryPendingRequests()}
                  disabled={status === "loading" || isOnline === false}
                />
              </View>
            ) : null}

            <ActionButton
              label={language === "es" ? "Enviar Solicitud" : "Submit Request"}
              onPress={submit}
              primary
              disabled={status === "loading" || !canSubmit}
              loading={status === "loading"}
            />
          </View>
        </View>
      </ScreenShell>

      <BottomTabs active="request" />
    </View>
  );
}
