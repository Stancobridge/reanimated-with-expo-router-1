import { StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { StyleGuide } from '../style';

const size = 32;
const styles = StyleSheet.create({
  bubble: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: StyleGuide.palette.primary,
  },
});

interface BubbleProps {
  progress: Animated.SharedValue<number | null>;
  start: number;
  end: number;
}

export const Bubble = ({ progress, start, end }: BubbleProps) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value as number, [start, end], [0.5, 1], Extrapolate.CLAMP);
    const scale = interpolate(progress.value as number, [start, end], [1, 1.5], Extrapolate.CLAMP);
    return { opacity, transform: [{ scale }] };
  });
  return <Animated.View style={[styles.bubble, style]} />;
};
