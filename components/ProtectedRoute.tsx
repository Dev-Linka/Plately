import { Redirect } from "expo-router";
import { ReactNode } from "react";
import { useAuth } from "@/helper/common";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="/profile" />;
  }

  return <>{children}</>;
}
