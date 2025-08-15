import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignin(): void {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_WEB;
  console.log('RNGoogleSignin webClientId:', webClientId); // must NOT be undefined
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_WEB,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_IOS,
    offlineAccess: true,
    forceCodeForRefreshToken: false,
    scopes: ['email', 'profile', 'openid'],
  });
}


