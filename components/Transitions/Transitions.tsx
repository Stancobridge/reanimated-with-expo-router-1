import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  WithSpringConfig,
  WithTimingConfig,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../Button';
import { cards } from '../Card';
import { StyleGuide } from '../style';
import { AnimatedCard } from './AnimatedCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    justifyContent: 'flex-end',
  },
});

const useSpring = (state: number | boolean, config?: WithSpringConfig) => {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = typeof state === 'number' ? state : Number(state);
  }, [state, value]);

  return useDerivedValue(() => {
    return withSpring(value.value, config);
  });
};

const useTiming = (state: number | boolean, config?: WithTimingConfig) => {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = typeof state === 'number' ? state : Number(state);
  }, [state, value]);

  return useDerivedValue(() => {
    return withTiming(value.value, config);
  });
};

export const UseTransition = () => {
  const toggled = useSharedValue(false);

  const transition = useDerivedValue(() => {
    return withSpring(Number(toggled.value));
  });

  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => (
        <AnimatedCard key={card} {...{ index, card, transition }} />
      ))}
      <Button
        label={toggled ? 'Reset' : 'Start'}
        primary
        onPress={() => {
          toggled.value = !toggled.value;
        }}
      />
    </View>
  );
};
