import { Redirect } from "expo-router";
import { useSession } from "../src/hooks/use-auth";
import { LoadingScreen } from "../src/components/ui/loading-screen";

export default function Index() {
  const { data, isPending } = useSession();

  // Aguarda a sessão carregar completamente antes de redirecionar
  if (isPending) {
    return <LoadingScreen />;
  }

  if (data?.user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
