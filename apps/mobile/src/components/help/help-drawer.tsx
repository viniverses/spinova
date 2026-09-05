import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type HelpDrawerProps = {
  isOpen?: boolean;
  onClose: () => void;
};

type HelpTopic = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const HelpDrawer = ({ isOpen, onClose }: HelpDrawerProps) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["75%"], []);

  const topics = useMemo<HelpTopic[]>(
    () => [
      {
        id: "returns",
        label: "Política de troca e devolução",
        icon: "swap-horizontal",
      },
      { id: "payments", label: "Formas de pagamento", icon: "card-outline" },
      { id: "delivery", label: "Tipos de entrega", icon: "bicycle-outline" },
      {
        id: "security",
        label: "Segurança e privacidade",
        icon: "shield-checkmark-outline",
      },
      { id: "other", label: "Outras dúvidas", icon: "help-circle-outline" },
    ],
    [],
  );

  const [query, setQuery] = useState("");
  const displayedTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return topics;
    return topics.filter((t) =>
      t.label.toLowerCase().includes(normalizedQuery),
    );
  }, [query, topics]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        opacity={0.55}
      />
    ),
    [],
  );

  const handleTopicPress = () => {
    bottomSheetRef.current?.close();
  };

  const handleSendPress = () => {
    bottomSheetRef.current?.close();
  };

  if (!isOpen) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onClose={onClose}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      topInset={insets.top}
      handleIndicatorStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        width: 64,
        height: 4,
      }}
      handleStyle={{
        backgroundColor: "#000000",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingTop: 12,
        paddingBottom: 8,
      }}
      backgroundStyle={{
        backgroundColor: "#000000",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
      }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          backgroundColor: "#000000",
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 18, 18),
        }}
      >
        <View className="items-center">
          <Text className="font-sans text-xl font-bold text-white text-center">
            Dúvidas e Informações
          </Text>
        </View>

        <View className="mt-4 rounded-2xl bg-[#171518] px-4 py-3">
          <View className="flex-row items-center gap-3">
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar"
              placeholderTextColor="rgba(255,255,255,0.45)"
              accessibilityLabel="Buscar dúvidas"
              style={{
                flex: 1,
                color: "#FFFFFF",
                paddingVertical: 0,
                fontSize: 16,
              }}
            />
            <Ionicons name="search" size={20} color="#A3A3A3" />
          </View>
        </View>

        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, marginTop: 20 }}
        >
          {displayedTopics.map((topic, index) => (
            <View key={topic.id}>
              <Pressable
                onPress={handleTopicPress}
                accessibilityRole="button"
                accessibilityLabel={topic.label}
                className="flex-row items-center gap-3 py-4"
              >
                <View className="h-7 w-7 items-center justify-center">
                  <Ionicons name={topic.icon} size={18} color="#FFFFFF" />
                </View>
                <Text className="flex-1 font-sans text-lg font-bold text-white">
                  {topic.label}
                </Text>
              </Pressable>

              {index < displayedTopics.length - 1 ? (
                <View className="h-px w-full bg-white/10" />
              ) : null}
            </View>
          ))}
        </BottomSheetScrollView>

        <Pressable
          onPress={handleSendPress}
          accessibilityRole="button"
          accessibilityLabel="Converse com a gente"
          className="mt-4 items-center justify-center rounded-2xl bg-primary px-6 py-4 active:opacity-90"
        >
          <View className="flex-row items-center gap-3">
            <Text className="font-sans text-base font-bold text-white">
              Converse com a gente!
            </Text>
            <View className="h-6 w-6 items-center justify-center rounded-full bg-black/15">
              <Ionicons
                name="chatbubble-ellipses"
                size={18}
                color="#FFFFFF"
              />
            </View>
          </View>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
};




