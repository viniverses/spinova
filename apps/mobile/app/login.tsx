import { Redirect } from "expo-router";
import { useSession } from "@/hooks/use-auth";
import AuthScreen from "@/components/auth/auth-screen";

export default function LoginRoute() {
  const { data } = useSession();

  if (data?.user) {
    return <Redirect href="/home" />;
  }

  return <AuthScreen />;
}
