import { app, auth } from '@/services/firebase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const db = getFirestore(app);

// Configure foreground handling to show notifications while app is open (no-op UI for now)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerPushToken(currentWorld: string | null): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  // Android channel
  await Notifications.setNotificationChannelAsync('alerts', {
    name: 'Alerts',
    importance: Notifications.AndroidImportance.MAX,
  });

  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (finalStatus !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    finalStatus = req.status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = (Constants?.expoConfig?.extra as any)?.eas?.projectId || Constants?.easConfig?.projectId;
  const tokenResp = await Notifications.getExpoPushTokenAsync({ projectId });
  const token = tokenResp?.data ?? null;

  if (token) {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        pushToken: token,
        currentWorld: currentWorld ?? null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
  return token;
}

export async function updateUserWorld(currentWorld: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  await setDoc(
    doc(db, 'users', user.uid),
    { currentWorld, updatedAt: serverTimestamp() },
    { merge: true }
  );
}


