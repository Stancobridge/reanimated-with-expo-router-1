import type { ReactElement } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SortableItem } from './SortableItem';

interface SortableListProps {
  children: ReactElement[];
  item: { width: number; height: number };
}

export const SortableList = ({ children, item: { height, width } }: SortableListProps) => {
  const activeCard = useSharedValue(-1);
  const offsets = children.map((_, i) => ({ y: useSharedValue(height * i) }));
  return (
    <ScrollView contentContainerStyle={{ height: height * (children.length + 0.5) }}>
      {children.map((child, index) => (
        <SortableItem height={height} width={width} offsets={offsets} index={index} key={index} activeCard={activeCard}>
          {child}
        </SortableItem>
      ))}
    </ScrollView>
  );
};
