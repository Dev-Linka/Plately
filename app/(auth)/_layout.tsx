import { useAuth } from "@/app/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    if (isAuthenticated) {
        return <Redirect href="/(protected)/(tabs)" />
    }
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    )
}