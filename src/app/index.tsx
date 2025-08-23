// app/index.tsx
import { useAuth } from "@/store/auth";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  return <Redirect href={user ? "/bosses" : "/onboarding"} />;
}
