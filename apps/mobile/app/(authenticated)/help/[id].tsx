import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { BackHandler, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HelpContactCard } from "@/components/help/help-contact-card";
import { HelpFaqAccordion } from "@/components/help/help-faq-accordion";
import { HelpSectionsList } from "@/components/help/help-sections-list";
import { getHelpTopicById, HELP_TOPICS } from "@/data/help-content";
import { useHelp } from "@/providers/help-provider";

export default function HelpDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { openHelp } = useHelp();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const topic = getHelpTopicById(id ?? "other") ?? HELP_TOPICS.other;

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
        <View className="rounded-2xl bg-surface-base p-5 border border-white/5">
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

        <HelpSectionsList sections={topic.sections} />

        <HelpFaqAccordion key={topic.id} faqs={topic.faqs} />

        <HelpContactCard />
      </ScrollView>
    </View>
  );
}
