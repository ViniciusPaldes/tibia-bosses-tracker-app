// app/(modals)/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalGroup() {
  return <Stack screenOptions={{ presentation: 'modal', headerShown: false }} />;
}