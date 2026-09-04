import { Redirect } from "expo-router";
import { useSession } from "@/hooks/use-auth";
import AuthScreen from "@/components/auth/auth-screen";

export default function LoginRoute() {
  const { data, isPending } = useSession();

  // Só redireciona se já está logado E não está carregando
  // Isso evita redirecionamento durante o processo de login
  if (!isPending && data?.user) {
    return <Redirect href="/home" />;
  }

  return <AuthScreen />;
}
