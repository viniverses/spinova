import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { HelpFAQ } from "@/data/help-content";

type HelpFaqAccordionProps = {
  faqs: HelpFAQ[];
};

export function HelpFaqAccordion({ faqs }: HelpFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <View className="mt-7">
      <Text className="font-sans text-lg font-bold text-white mb-3">
        Perguntas Frequentes
      </Text>

      <View className="gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <Pressable
              key={`${faq.question}-${idx}`}
              onPress={() => toggleFaq(idx)}
              accessibilityRole="button"
              accessibilityLabel={faq.question}
              accessibilityState={{ expanded: isOpen }}
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
  );
}
