import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Examples() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Examples Screen</Text>
      <Link href="/examples/modal">Present modal</Link>
    </View>
  );
}
