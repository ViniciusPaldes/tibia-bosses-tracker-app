import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignin(): void {
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // For Android, GoogleSignin uses the webClientId for ID token; but we also expose androidClientId for completeness.
    // Some setups prefer server/web client id for offline access.
    // The library ignores unknown keys, so leaving both is safe.
    // @ts-expect-error - androidClientId is not in types but accepted by native config plugin
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
}


