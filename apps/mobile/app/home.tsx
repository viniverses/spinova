import { authClient } from "@/lib/auth-client";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text>Home Page</Text>
        <Button onPress={() => authClient.signOut()} title="Sair" />
      </View>
    </SafeAreaView>
  );
}
