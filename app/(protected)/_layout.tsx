import { useAuth } from "@/app/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/login" />
  return (
    <Stack
      screenOptions={{ headerShown: false }}
    >
        <Stack.Screen
        name="(tabs)"
      />
      
    </Stack>
  );
}
