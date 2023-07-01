import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { mix } from 'react-native-redash';
import { Card, type Cards } from '../Card';
import { StyleGuide } from '../style';

const { width } = Dimensions.get('window');
const origin = -(width / 2 - StyleGuide.spacing * 2);
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: StyleGuide.spacing * 4,
  },
});

interface AnimatedCardProps {
  index: number;
  card: Cards;
  transition: Readonly<Animated.SharedValue<number>>;
}

export const AnimatedCard = ({ card, index, transition }: AnimatedCardProps) => {
  const style = useAnimatedStyle(() => {
    const rotate = mix(transition.value, 0, ((index - 1) * Math.PI) / 6);
    return {
      transform: [{ translateX: origin }, { rotate: `${rotate}rad` }, { translateX: -origin }],
    };
  });

  return (
    <Animated.View key={card} style={[styles.overlay, style]}>
      <Card {...{ card }} />
    </Animated.View>
  );
};
