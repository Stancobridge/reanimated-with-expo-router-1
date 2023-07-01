import { Link, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function Modal() {
  const navigation = useNavigation();
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = navigation.canGoBack();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      <Text>
        Hello
        {isPresented && <Link href="/examples">Dismiss</Link>}
      </Text>

      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="dark" />
    </View>
  );
}
