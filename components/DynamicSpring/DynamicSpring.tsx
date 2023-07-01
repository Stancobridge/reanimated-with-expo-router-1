import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { CARD_HEIGHT, CARD_WIDTH, Card, Cards } from '../Card';
import { DraggableCard } from './DraggableCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

interface DynamicSpringProps {
  width: number;
  height: number;
}

export const DynamicSpring = ({ width, height }: DynamicSpringProps) => {
  const translate = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };
  const translateX2 = useDerivedValue(() => withSpring(translate.x.value));
  const translateY2 = useDerivedValue(() => withSpring(translate.y.value));

  const translateX3 = useDerivedValue(() => withSpring(translateX2.value));
  const translateY3 = useDerivedValue(() => withSpring(translateY2.value));

  const style2 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX2.value }, { translateY: translateY2.value }],
  }));

  const style3 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX3.value }, { translateY: translateY3.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, style3]}>
        <Card card={Cards.Card3} />
      </Animated.View>
      <Animated.View style={[styles.card, style2]}>
        <Card card={Cards.Card2} />
      </Animated.View>
      <DraggableCard {...{ width, height, translate }} />
    </View>
  );
};
