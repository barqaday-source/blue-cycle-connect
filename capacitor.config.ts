import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tadweer.blue",
  appName: "تدوير بلو",
  webDir: "dist",
  bundledWebRuntime: false,
  backgroundColor: "#1E63FF",
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#1E63FF",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
