import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import { colors } from "../../lib/theme";

type PasswordVisibilityToggleProps = {
  visible: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const PasswordVisibilityToggle = ({
  visible,
  disabled = false,
  onPress,
}: PasswordVisibilityToggleProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className="absolute right-1 top-1 h-12 w-12 items-center justify-center rounded-xl active:bg-white/10 disabled:opacity-50"
    accessibilityRole="button"
    accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
    accessibilityHint="Alterna a visibilidade da senha"
    accessibilityState={{ disabled }}
  >
    <Ionicons
      name={visible ? "eye-off-outline" : "eye-outline"}
      size={22}
      color={colors.primary.DEFAULT}
      accessible={false}
    />
  </Pressable>
);
