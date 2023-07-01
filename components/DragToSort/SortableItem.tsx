import { ReactElement } from 'react';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SortableItemProps {
  index: number;
  offsets: {
    y: SharedValue<number>;
  }[];
  children: ReactElement;
  width: number;
  height: number;
  activeCard: SharedValue<number>;
}

export const SortableItem = ({ activeCard, children, index, offsets, height, width }: SortableItemProps) => {
  const isGestureActive = useSharedValue(false);
  const currentOffset = offsets[index];
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { offsetY: number }>({
    onStart: (_, ctx) => {
      isGestureActive.value = true;
      activeCard.value = index;
      ctx.offsetY = currentOffset.y.value;
    },
    onActive: (event, ctx) => {
      x.value = event.translationX;
      y.value = event.translationY + ctx.offsetY;

      const offsetY = Math.round(y.value / height) * height;

      offsets.forEach((offset, i) => {
        if (offset.y.value === offsetY && index !== i) {
          offset.y.value = currentOffset.y.value;
          currentOffset.y.value = offsetY;
        }
      });
    },
    onEnd: () => {
      x.value = withSpring(0);
      y.value = withSpring(currentOffset.y.value, {});
    },
    onFinish: () => {
      isGestureActive.value = false;
    },
  });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return withSpring(y.value);
    } else {
      return withSpring(currentOffset.y.value);
    }
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height,
    width,
    transform: [
      {
        translateY: translateY.value,
      },
      {
        translateX: x.value,
      },
      {
        scale: withSpring(isGestureActive.value ? 1.05 : 1),
      },
    ],
    zIndex: activeCard.value === index ? 100 : 1,
  }));
  return (
    <PanGestureHandler {...{ onGestureEvent }}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};
