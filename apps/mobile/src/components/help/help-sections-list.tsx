import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { HelpSection } from "@/data/help-content";

type HelpSectionsListProps = {
  sections: HelpSection[];
};

export function HelpSectionsList({ sections }: HelpSectionsListProps) {
  if (sections.length === 0) return null;

  return (
    <View className="mt-6 gap-4">
      <Text className="font-sans text-lg font-bold text-white">
        Diretrizes e Orientações
      </Text>

      {sections.map((section, idx) => (
        <View
          key={`${section.title}-${idx}`}
          className="rounded-2xl bg-[#121113] p-4 border border-white/5"
        >
          <View className="flex-row items-center gap-3 mb-2.5">
            {section.icon ? (
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Ionicons name={section.icon} size={18} color="#FFFFFF" />
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
  );
}
