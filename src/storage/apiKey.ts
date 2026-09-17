import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'english-ear:gemini-api-key';

/**
 * expo-secure-store has no web implementation (no Keychain/Keystore there),
 * so the key falls back to AsyncStorage on web.
 */
export async function getGeminiApiKey(): Promise<string | null> {
  if (Platform.OS === 'web') return AsyncStorage.getItem(KEY);
  return SecureStore.getItemAsync(KEY);
}

export async function saveGeminiApiKey(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(KEY, value);
    return;
  }
  await SecureStore.setItemAsync(KEY, value);
}

export async function clearGeminiApiKey(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
