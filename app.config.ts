// app.config.ts
import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'tibia-bosses-tracker-app',
  slug: 'tibia-bosses-tracker-app',
  owner: "viniciuspaldes",
  version: '1.1.1',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'tibiabossestrackerapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "br.com.tibiawiki.tibiabosstracker",
    supportsTablet: true
  },
  android: {
    package: "br.com.tibiawiki.tibiabosstracker",
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
  },
  web: { bundler: 'metro', output: 'static', favicon: './assets/images/favicon.png' },
  plugins: [
    'expo-router',
    ['expo-splash-screen', { image: './assets/images/splash-icon.png', imageWidth: 200, resizeMode: 'contain', backgroundColor: '#ffffff' }],
    'expo-font',
    '@react-native-google-signin/google-signin',
  ],
  experiments: { typedRoutes: true },
  extra: {
    eas: { projectId: process.env.EAS_PROJECT_ID },
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },

    // optional but recommended for platform‑specific Google sign‑in
    googleOAuth: {
      android: process.env.GOOGLE_OAUTH_CLIENT_ID_ANDROID,
      ios: process.env.GOOGLE_OAUTH_CLIENT_ID_IOS,
      web: process.env.GOOGLE_OAUTH_CLIENT_ID_WEB,
    },
  },
}
);


