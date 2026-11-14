import { Ionicons } from "@expo/vector-icons";
import { Alert, Linking, Pressable, Text, View } from "react-native";

const WHATSAPP_SUPPORT_URL =
  "https://wa.me/5511999999999?text=Ol%C3%A1,%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20meu%20pedido%20de%20vinil";
const EMAIL_SUPPORT_URL =
  "mailto:suporte@spinovavinil.com.br?subject=Dúvida%20sobre%20Vinil";

export function HelpContactCard() {
  const handleContactPress = () => {
    Alert.alert(
      "Atendimento Spinova",
      "Como deseja entrar em contato com nossa equipe de suporte?",
      [
        {
          text: "WhatsApp",
          onPress: () => {
            void Linking.openURL(WHATSAPP_SUPPORT_URL);
          },
        },
        {
          text: "E-mail",
          onPress: () => {
            void Linking.openURL(EMAIL_SUPPORT_URL);
          },
        },
        { text: "Cancelar", style: "cancel" },
      ],
    );
  };

  return (
    <View className="mt-8 rounded-2xl bg-[#1C1A1F] p-5 border border-white/10 items-center text-center">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-3">
        <Ionicons name="chatbubbles-outline" size={24} color="#FFFFFF" />
      </View>
      <Text className="font-sans text-lg font-bold text-white text-center">
        Ainda ficou com alguma dúvida?
      </Text>
      <Text className="mt-1 font-golos text-xs text-white/60 text-center leading-4 px-3">
        Nossa equipe de especialistas em discos de vinil está pronta para ajudar
        você.
      </Text>

      <Pressable
        onPress={handleContactPress}
        accessibilityRole="button"
        accessibilityLabel="Falar com o suporte"
        className="mt-4 w-full items-center justify-center rounded-xl bg-primary py-3.5 px-4 active:opacity-90"
      >
        <View className="flex-row items-center gap-2">
          <Text className="font-sans text-sm font-bold text-white">
            Falar com a gente
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
}
