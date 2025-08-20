// app.config.ts
import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Tibia Boss Tracker',
  slug: 'tibia-bosses-tracker-app',
  owner: "viniciuspaldes",
  version: '1.1.2',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'tibiabossestrackerapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "br.com.tibiawiki.tibiabosstracker",
    googleServicesFile: "./GoogleService-Info.plist",
    supportsTablet: true
  },
  android: {
    package: "br.com.tibiawiki.tibiabosstracker",
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0E0E0E',
    },
    edgeToEdgeEnabled: true,
  },
  updates: {
    url: 'https://u.expo.dev/737b3d74-a428-4a41-a270-b878fcc99106',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  web: { bundler: 'metro', output: 'static', favicon: './assets/images/favicon.png' },
  plugins: [
    'expo-router',
    ['expo-splash-screen', {
      image: './assets/images/splash-icon.png',
      resizeMode: 'cover',
      imageWidth: 200,
      backgroundColor: '#0E0E0E'
    }],
    'expo-font',
    ['@react-native-google-signin/google-signin', {
      iosUrlScheme: "com.googleusercontent.apps.735049719990-se4dt61iojd6j6pbn56c22fjkca5ctvv"
    }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    eas: { projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID },
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },

    // optional but recommended for platform‑specific Google sign‑in
    googleOAuth: {
      android: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_ANDROID,
      ios: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_IOS,
      web: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_WEB,
    },
  },
}
);


