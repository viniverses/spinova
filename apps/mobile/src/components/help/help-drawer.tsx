import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HelpDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type HelpTopic = {
  id: string;
  label: string;
  icon: string;
};

export const HelpDrawer = ({ isOpen, onClose }: HelpDrawerProps) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const topics = useMemo<HelpTopic[]>(
    () => [
      { id: "returns", label: "Política de troca e devolução", icon: "swap-horizontal" },
      { id: "payments", label: "Formas de pagamento", icon: "card-outline" },
      { id: "delivery", label: "Tipos de entrega", icon: "bicycle-outline" },
      { id: "security", label: "Segurança e privacidade", icon: "shield-checkmark-outline" },
      { id: "other", label: "Outras dúvidas", icon: "help-circle-outline" },
    ],
    [],
  );

  const [query, setQuery] = useState("");
  const displayedTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return topics;
    return topics.filter((t) => t.label.toLowerCase().includes(normalizedQuery));
  }, [query, topics]);

  const translateY = useRef(new Animated.Value(height)).current;
  const currentTranslateYRef = useRef(height);
  const startTranslateYRef = useRef(0);

  const animateTo = (toValue: number, onDone?: () => void) => {
    Animated.timing(translateY, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      currentTranslateYRef.current = toValue;
      onDone?.();
    });
  };

  const clamp = (value: number, min: number, max: number) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startTranslateYRef.current = currentTranslateYRef.current;
      },
      onPanResponderMove: (_evt, gestureState) => {
        const next = clamp(
          startTranslateYRef.current + gestureState.dy,
          0,
          height,
        );
        currentTranslateYRef.current = next;
        translateY.setValue(next);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        // Fecha se puxar o suficiente.
        const closeThresholdPx = Math.max(90, height * 0.22);
        const shouldClose =
          currentTranslateYRef.current > closeThresholdPx ||
          gestureState.dy > closeThresholdPx;

        if (shouldClose) {
          animateTo(height, onClose);
          return;
        }

        animateTo(0);
      },
    }),
  ).current;

  useEffect(() => {
    if (!isOpen) {
      currentTranslateYRef.current = height;
      translateY.setValue(height);
      return;
    }

    setQuery("");
    currentTranslateYRef.current = 0;
    Animated.timing(translateY, {
      toValue: 0,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [height, isOpen, translateY]);

  const handleBackdropPress = () => {
    onClose();
  };

  const handleTopicPress = () => {
    // Ex.: abrir uma tela/faq no futuro.
    onClose();
  };

  const handleSendPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar ajuda"
          onPress={handleBackdropPress}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)" }}
        />

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateY }],
          }}
        >
          <View
            className="bg-black px-4 pt-3"
            style={{
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              minHeight: height * 0.72,
              paddingBottom: Math.max(insets.bottom + 18, 18),
            }}
          >
            <View className="items-center">
              <View
                className="h-4 w-full items-center justify-center"
                {...panResponder.panHandlers}
                accessibilityRole="adjustable"
                accessibilityLabel="Arrastar para fechar"
              >
                <View className="h-1 w-16 rounded-full bg-white/30" />
              </View>
            </View>

            <View className="items-center">
              <Text className="font-sans text-xl font-bold text-white text-center">
                Dúvidas e Informações
              </Text>
            </View>

            <View className="mt-4 rounded-2xl bg-[#171518] px-4 py-3">
              <View className="flex-row items-center gap-3">
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Buscar"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  accessibilityLabel="Buscar dúvidas"
                  style={{ flex: 1, color: "#FFFFFF", paddingVertical: 0 }}
                />
                <Ionicons name="search" size={20} color="#A3A3A3" />
              </View>
            </View>

            <View className="mt-5 flex-1">
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 8 }}
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
                        <Ionicons
                          name={topic.icon}
                          size={18}
                          color="#FFFFFF"
                        />
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
              </ScrollView>
            </View>

            <Pressable
              onPress={handleSendPress}
              accessibilityRole="button"
              accessibilityLabel="Converse com a gente"
              className="mt-6 items-center justify-center rounded-2xl bg-primary px-6 py-4 active:opacity-90"
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
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

