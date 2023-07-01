import React, { useState } from 'react';

import { LayoutRectangle, StyleSheet, View } from 'react-native';
import { Loading } from '../components/Loading/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
});

const HomePage = () => {
  const [container, setContainer] = useState<null | LayoutRectangle>(null);

  return (
    <View style={styles.container} onLayout={({ nativeEvent: { layout } }) => setContainer(layout)}>
      <Loading />
    </View>
  );
};

export default HomePage;
