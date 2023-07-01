import { Dimensions, StyleSheet, View } from 'react-native';

import { CARD_HEIGHT, Card, Cards } from '../Card';
import { SortableList } from './SortableList';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
});
const cards = [Cards.Card1, Cards.Card2, Cards.Card3];

export const DragToSort = () => {
  return (
    <SortableList item={{ width, height: CARD_HEIGHT + 32 }}>
      {cards.map((card, index) => (
        <View style={styles.card} key={index}>
          <Card card={card} />
        </View>
      ))}
    </SortableList>
  );
};
