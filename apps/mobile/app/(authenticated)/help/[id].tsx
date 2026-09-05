import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getHelpTopicById, HELP_TOPICS } from "../../../data/help-content";
import { useHelp } from "@/providers/help-provider";

export default function HelpDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { openHelp } = useHelp();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const topic = getHelpTopicById(id ?? "other") ?? HELP_TOPICS.other;

  // Estado para os itens abertos do FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleBack = useCallback(() => {
    openHelp();
    router.back();
  }, [openHelp, router]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      openHelp();
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      },
    );

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, handleBack, openHelp]);

  const handleContactPress = () => {
    Alert.alert(
      "Atendimento Spinova",
      "Como deseja entrar em contato com nossa equipe de suporte?",
      [
        {
          text: "WhatsApp",
          onPress: () => {
            void Linking.openURL(
              "https://wa.me/5511999999999?text=Ol%C3%A1,%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20meu%20pedido%20de%20vinil",
            );
          },
        },
        {
          text: "E-mail",
          onPress: () => {
            void Linking.openURL(
              "mailto:suporte@spinovavinil.com.br?subject=Dúvida%20sobre%20Vinil",
            );
          },
        },
        { text: "Cancelar", style: "cancel" },
      ],
    );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom + 28, 28),
        }}
      >
        {/* Banner de Categoria / Badge */}
        <View className="rounded-2xl bg-[#171518] p-5 border border-white/5">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="rounded-full bg-primary/20 px-3 py-1">
              <Text className="font-golos-semibold text-xs text-primary">
                {topic.badge}
              </Text>
            </View>
          </View>
          <Text className="font-sans text-2xl font-bold text-white mb-1">
            {topic.title}
          </Text>
          <Text className="font-golos text-sm text-white/70 leading-5">
            {topic.subtitle}
          </Text>
        </View>

        {/* Seções Informativas */}
        <View className="mt-6 gap-4">
          <Text className="font-sans text-lg font-bold text-white">
            Diretrizes e Orientações
          </Text>

          {topic.sections.map((section, idx) => (
            <View
              key={idx}
              className="rounded-2xl bg-[#121113] p-4 border border-white/5"
            >
              <View className="flex-row items-center gap-3 mb-2.5">
                {section.icon ? (
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Ionicons
                      name={section.icon}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>
                ) : null}
                <Text className="flex-1 font-sans text-base font-bold text-white">
                  {section.title}
                </Text>
              </View>

              <Text className="font-golos text-sm text-white/70 leading-5">
                {section.description}
              </Text>

              {section.tips && section.tips.length > 0 ? (
                <View className="mt-3.5 pt-3 border-t border-white/10 gap-2">
                  {section.tips.map((tip, tipIdx) => (
                    <View key={tipIdx} className="flex-row items-start gap-2">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#4ADE80"
                        style={{ marginTop: 2 }}
                      />
                      <Text className="flex-1 font-golos text-xs text-white/80 leading-4">
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>

        {/* Perguntas Frequentes (FAQ) */}
        {topic.faqs && topic.faqs.length > 0 ? (
          <View className="mt-7">
            <Text className="font-sans text-lg font-bold text-white mb-3">
              Perguntas Frequentes
            </Text>

            <View className="gap-3">
              {topic.faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;

                return (
                  <Pressable
                    key={fIdx}
                    onPress={() => toggleFaq(fIdx)}
                    accessibilityRole="button"
                    accessibilityLabel={faq.question}
                    className="rounded-2xl bg-[#171518] p-4 border border-white/5 active:opacity-90"
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="flex-1 font-golos-semibold text-sm text-white">
                        {faq.question}
                      </Text>
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#A3A3A3"
                      />
                    </View>

                    {isOpen ? (
                      <Text className="mt-3 pt-3 border-t border-white/10 font-golos text-xs text-white/70 leading-5">
                        {faq.answer}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Card de Atendimento / Dúvidas */}
        <View className="mt-8 rounded-2xl bg-[#1C1A1F] p-5 border border-white/10 items-center text-center">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-3">
            <Ionicons
              name="chatbubbles-outline"
              size={24}
              color="#FFFFFF"
            />
          </View>
          <Text className="font-sans text-lg font-bold text-white text-center">
            Ainda ficou com alguma dúvida?
          </Text>
          <Text className="mt-1 font-golos text-xs text-white/60 text-center leading-4 px-3">
            Nossa equipe de especialistas em discos de vinil está pronta para ajudar você.
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
      </ScrollView>
    </View>
  );
}
