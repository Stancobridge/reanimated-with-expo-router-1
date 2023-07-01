import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { clamp } from 'react-native-redash';

import { CARD_HEIGHT, CARD_WIDTH, Card, Cards } from '../Card';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface GestureProps {
  width: number;
  height: number;
}

export const PanGesture = ({ width, height }: GestureProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (
      _,
      ctx: {
        offsetY: number;
        offsetX: number;
      },
    ) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (
      event,
      ctx: {
        offsetY: number;
        offsetX: number;
      },
    ) => {
      translateX.value = clamp(event.translationX + ctx.offsetX, 0, boundX);
      translateY.value = clamp(event.translationY + ctx.offsetY, 0, boundY);
    },
    onEnd: (event) => {
      translateX.value = withDecay({ velocity: event.velocityX, clamp: [0, boundX] });
      translateY.value = withDecay({ velocity: event.velocityY, clamp: [0, boundY] });
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View {...{ style }}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
