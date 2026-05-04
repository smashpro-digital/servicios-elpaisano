import Constants from "expo-constants";

export type PushRegistrationResult =
  | { status: "granted"; token: string }
  | { status: "denied" | "unavailable"; token: null; reason: string };

const isExpoGo = Constants.appOwnership === "expo";
let notificationHandlerConfigured = false;

async function loadNotifications() {
  return import("expo-notifications");
}

async function configureNotificationHandler() {
  if (notificationHandlerConfigured) return;

  const Notifications = await loadNotifications();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  notificationHandlerConfigured = true;
}

export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  if (isExpoGo) {
    console.log("Push notifications skipped in Expo Go.");
    return {
      status: "unavailable",
      token: null,
      reason: "Push notifications are unavailable in Expo Go.",
    };
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    return {
      status: "unavailable",
      token: null,
      reason: "Missing EAS project id.",
    };
  }

  try {
    await configureNotificationHandler();

    const Notifications = await loadNotifications();
    const current = await Notifications.getPermissionsAsync();
    const finalStatus =
      current.status === "granted"
        ? current.status
        : (await Notifications.requestPermissionsAsync()).status;

    if (finalStatus !== "granted") {
      return {
        status: "denied",
        token: null,
        reason: "Notification permission was not granted.",
      };
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return { status: "granted", token: token.data };
  } catch (error) {
    return {
      status: "unavailable",
      token: null,
      reason:
        error instanceof Error
          ? error.message
          : "Unable to register for push notifications.",
    };
  }
}
