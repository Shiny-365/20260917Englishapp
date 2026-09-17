import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ProgressProvider } from './src/context/ProgressContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
