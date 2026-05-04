import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor configuration
 * Path B: Remote Web Wrapper
 *
 * This app loads live content from https://servicioselpaisano.com
 * while providing a native shell for iOS and Android.
 */

const config: CapacitorConfig = {
  appId: 'com.servicioselpaisano.app',
  appName: 'Servicios El Paisano',

  /**
   * webDir is required by Capacitor even when using server.url.
   * We keep "public" as a fallback directory.
   */
  webDir: 'public',

  /**
   * Remote server configuration
   * The app will load the live website inside a WKWebView / WebView.
   */
  server: {
    url: 'https://servicioselpaisano.com',

    /**
     * HTTPS only — do NOT allow cleartext traffic.
     * This keeps iOS ATS and Play Store happy.
     */
    cleartext: false
  }
};

export default config;
