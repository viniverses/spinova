import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_LENGTH = 414;
const MARK_SIZE = 184;

export function PurchaseCompleteMark() {
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(reduceMotion ? 720 : 0);
  const ringProgress = useSharedValue(reduceMotion ? 1 : 0);
  const badgeProgress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      rotation.value = 720;
      ringProgress.value = 1;
      badgeProgress.value = 1;
      return;
    }

    rotation.value = 0;
    ringProgress.value = 0;
    badgeProgress.value = 0;

    // Slower, smoother vinyl rotation decelerating realistically
    rotation.value = withTiming(720, {
      duration: 2200,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Outer ring draws smoothly along the vinyl groove
    ringProgress.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
    });

    // Check badge pops in with a pleasant spring bounce once spin settles
    badgeProgress.value = withDelay(
      1800,
      withTiming(1, {
        duration: 380,
        easing: Easing.out(Easing.back(1.6)),
      }),
    );

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(ringProgress);
      cancelAnimation(badgeProgress);
    };
  }, [badgeProgress, reduceMotion, ringProgress, rotation]);

  const ringAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_LENGTH * (1 - ringProgress.value),
  }));

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(badgeProgress.value, [0, 0.4, 1], [0, 0.8, 1]),
    transform: [
      {
        scale: interpolate(badgeProgress.value, [0, 1], [0, 1]),
      },
    ],
  }));

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel="Compra concluída"
      style={{ width: MARK_SIZE, height: MARK_SIZE }}
    >
      <Animated.View style={discStyle}>
        <Svg width={MARK_SIZE} height={MARK_SIZE} viewBox="0 0 184 184">
          <Circle
            cx="92"
            cy="92"
            r="78"
            fill="#121012"
            stroke="#3A3438"
            strokeWidth="2"
          />
          <Circle
            cx="92"
            cy="92"
            r="59"
            fill="none"
            stroke="#292529"
            strokeWidth="1.5"
          />
          <Circle
            cx="92"
            cy="92"
            r="49"
            fill="none"
            stroke="#252125"
            strokeWidth="1"
          />
          <Circle
            cx="92"
            cy="92"
            r="39"
            fill="none"
            stroke="#302B2F"
            strokeWidth="1"
          />
          <AnimatedCircle
            animatedProps={ringAnimatedProps}
            cx="92"
            cy="92"
            r="66"
            fill="none"
            stroke="#E14842"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            transform="rotate(-90 92 92)"
          />
          <Circle cx="92" cy="92" r="19" fill="#E14842" />
          <Path
            d="M92 75 L92 84"
            fill="none"
            stroke="#FF8A85"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Circle cx="92" cy="92" r="5" fill="#171315" />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#E14842",
            borderWidth: 3.5,
            borderColor: "#000000",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 6,
          },
          badgeStyle,
        ]}
      >
        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
      </Animated.View>
    </Animated.View>
  );
}
