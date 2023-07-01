import { StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue } from 'react-native-reanimated';
import type { ProfileModel } from './Profile';
import { Profile } from './Profile';

interface SwiperProps {
  onSwipe: () => void;
  profile: ProfileModel;
  onTop: boolean;
}

type Offset = {
  x: number;
  y: number;
};

export const Swiper = ({ profile, onTop }: SwiperProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, Offset>({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.x;
      translateY.value = event.translationY + ctx.y;
    },
  });
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Profile profile={profile} onTop={onTop} translateX={translateX} translateY={translateY} />
      </Animated.View>
    </PanGestureHandler>
  );
};
