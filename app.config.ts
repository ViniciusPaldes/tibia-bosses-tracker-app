import 'dotenv/config';

export default ({ config }: any) => ({
  expo: {
    name: 'tibia-bosses-tracker-app',
    slug: 'tibia-bosses-tracker-app',
    owner: "viniciuspaldes",
    version: '1.0.0',
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
    ],
    experiments: { typedRoutes: true },
    extra: {
      eas: { projectId: process.env.EAS_PROJECT_ID },
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
  },
});


