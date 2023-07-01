import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Easing } from 'react-native-reanimated';

const _color = '#6E01EF';
const _size = 100;

export const PhoneRing = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[styles.dot, styles.center]}>
        {[1, 2, 3].map((index) => (
          <MotiView
            key={index}
            from={{
              opacity: 0.5,
              scale: 1,
            }}
            animate={{
              scale: 4,
              opacity: 0,
            }}
            transition={{
              type: 'timing',
              loop: true,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              delay: index * 400,
              repeatReverse: false,
            }}
            style={[StyleSheet.absoluteFill, styles.dot]}
          />
        ))}
        <Feather name="phone-outgoing" size={32} color="#fff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: _size,
    height: _size,
    borderRadius: _size,
    backgroundColor: _color,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
