import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedGestureHandler, withDecay } from 'react-native-reanimated';
import { clamp } from 'react-native-redash';

import { useTranslate } from '../AnimatedHelpers';
import { CARD_HEIGHT, CARD_WIDTH, Card, Cards } from '../Card';

interface DraggableCardProps {
  width: number;
  height: number;
  translate: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
}

export const DraggableCard = ({ translate, width, height }: DraggableCardProps) => {
  const boundX = width - CARD_WIDTH;
  const boundY = height - CARD_HEIGHT;
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offsetX: number;
      offsetY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translate.x.value;
      ctx.offsetY = translate.y.value;
    },
    onActive: (event, ctx) => {
      translate.x.value = clamp(ctx.offsetX + event.translationX, 0, boundX);
      translate.y.value = clamp(ctx.offsetY + event.translationY, 0, boundY);
    },
    onEnd: ({ velocityX, velocityY }) => {
      translate.x.value = withDecay({ velocity: velocityX, clamp: [0, boundX] });
      translate.y.value = withDecay({ velocity: velocityY, clamp: [0, boundY] });
    },
  });

  const style = useTranslate(translate);

  return (
    <PanGestureHandler {...{ onGestureEvent }}>
      <Animated.View {...{ style }}>
        <Card card={Cards.Card1} />
      </Animated.View>
    </PanGestureHandler>
  );
};
