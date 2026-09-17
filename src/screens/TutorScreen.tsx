import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WORDS } from '../data/words';
import type { Word } from '../types/word';
import { useSpeak } from '../hooks/useSpeak';
import { useSpeechRecognizer } from '../hooks/useSpeechRecognizer';
import { getGeminiApiKey, saveGeminiApiKey } from '../storage/apiKey';
import { GeminiApiError, sendChatMessage, type ChatMessage } from '../services/gemini';
import { pickRandom } from '../utils/random';
import { colors, radius, spacing } from '../theme';

type DisplayMessage = { id: string; role: 'user' | 'model' | 'note'; text: string };

const TOPIC_WORD_COUNT = 5;

function buildSystemInstruction(topicWords: Word[]): string {
  const wordList = topicWords.map((w) => w.text).join(', ');
  return [
    'You are a friendly, encouraging English conversation tutor for a Korean learner practicing spoken English.',
    'Reply only in English, using short, simple, natural sentences (max 2-3 sentences).',
    `When relevant, naturally use these vocabulary words in your replies: ${wordList}.`,
    'If the learner makes a grammar or word-choice mistake, add one short correction line in Korean starting with "💡", then continue the conversation in English.',
    'Keep the tone warm and supportive, like chatting with a friend. Do not use markdown formatting.',
  ].join(' ');
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function TutorScreen() {
  const { speak } = useSpeak();
  const { status: micStatus, start: startMic, stop: stopMic } = useSpeechRecognizer();

  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [keySaveError, setKeySaveError] = useState<string | null>(null);

  const [topicWords, setTopicWords] = useState<Word[]>(() => pickRandom(WORDS, TOPIC_WORD_COUNT));
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRetryText, setPendingRetryText] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getGeminiApiKey().then((key) => {
      setApiKey(key);
      setIsLoadingKey(false);
    });
  }, []);

  const handleSaveKey = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setKeySaveError('API 키를 입력해주세요.');
      return;
    }
    setKeySaveError(null);
    await saveGeminiApiKey(trimmed);
    setApiKey(trimmed);
    setKeyInput('');
  };

  const handleChangeKey = () => {
    setApiKey(null);
    setKeyInput('');
  };

  const startNewConversation = useCallback(() => {
    setTopicWords(pickRandom(WORDS, TOPIC_WORD_COUNT));
    setMessages([]);
    setErrorMessage(null);
    setPendingRetryText(null);
  }, []);

  const doSend = async (text: string) => {
    if (!apiKey) return;
    const userMessage: DisplayMessage = { id: makeId(), role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setErrorMessage(null);
    setPendingRetryText(null);

    const history: ChatMessage[] = [...messages, userMessage]
      .filter((m) => m.role !== 'note')
      .map((m) => ({ role: m.role as 'user' | 'model', text: m.text }));

    try {
      const reply = await sendChatMessage(apiKey, history, buildSystemInstruction(topicWords));
      setMessages((prev) => [...prev, { id: makeId(), role: 'model', text: reply }]);
    } catch (err) {
      const message = err instanceof GeminiApiError ? err.message : '알 수 없는 오류가 발생했어요.';
      setErrorMessage(message);
      setPendingRetryText(text);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput('');
    doSend(trimmed);
  };

  const handleRetry = () => {
    if (!pendingRetryText || isSending) return;
    const text = pendingRetryText;
    setMessages((prev) => prev.slice(0, -1));
    doSend(text);
  };

  const handleMic = () => {
    if (micStatus === 'listening') {
      stopMic();
      return;
    }
    startMic((finalTranscript) => {
      if (finalTranscript) setInput(finalTranscript);
    });
  };

  if (isLoadingKey) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!apiKey) {
    return (
      <View style={styles.container}>
        <View style={styles.keySetupBlock}>
          <Text style={styles.header}>🤖 AI 튜터</Text>
          <Text style={styles.helper}>
            Gemini API 키를 입력하면 오늘 배운 단어로 AI와 짧은 영어 대화를 연습할 수 있어요.
          </Text>
          <Text style={styles.keyHint}>
            API 키는 Google AI Studio(aistudio.google.com/apikey)에서 무료로 발급받을 수 있어요. 입력한 키는 이
            기기에만 안전하게 저장되고, 대화할 때마다 Google Gemini API로 직접 전송됩니다.
          </Text>
          <TextInput
            style={styles.keyInput}
            placeholder="Gemini API 키를 붙여넣으세요"
            placeholderTextColor={colors.textMuted}
            value={keyInput}
            onChangeText={setKeyInput}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          {keySaveError && <Text style={styles.errorText}>{keySaveError}</Text>}
          <Pressable style={styles.saveKeyButton} onPress={handleSaveKey}>
            <Text style={styles.saveKeyButtonText}>저장하고 시작하기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.header}>🤖 AI 튜터</Text>
          <Text style={styles.helper}>오늘의 단어로 짧은 영어 대화를 나눠보세요</Text>
        </View>
        <Pressable onPress={handleChangeKey}>
          <Text style={styles.linkText}>API 키 변경</Text>
        </Pressable>
      </View>

      <View style={styles.topicRow}>
        {topicWords.map((w) => (
          <Pressable key={w.id} style={styles.topicChip} onPress={() => speak(w.text)}>
            <Text style={styles.topicChipText}>{w.text}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.resetChip} onPress={startNewConversation}>
          <Text style={styles.resetChipText}>🔄 새 대화</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.noteBubble}>
            <Text style={styles.noteText}>
              안녕하세요! 위 단어들을 활용해서 편하게 영어로 말을 걸어보세요. 마이크 버튼으로 말해도 좋아요.
            </Text>
          </View>
        )}
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === 'user' ? styles.bubbleUser : styles.bubbleModel,
            ]}
          >
            <Text style={m.role === 'user' ? styles.bubbleUserText : styles.bubbleModelText}>{m.text}</Text>
            {m.role === 'model' && (
              <Pressable style={styles.speakButton} onPress={() => speak(m.text)}>
                <Text style={styles.speakButtonText}>🔊</Text>
              </Pressable>
            )}
          </View>
        ))}
        {isSending && (
          <View style={[styles.bubble, styles.bubbleModel]}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      </ScrollView>

      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
          {pendingRetryText && (
            <Pressable onPress={handleRetry}>
              <Text style={styles.retryText}>다시 시도</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.inputRow}>
        <Pressable
          style={[styles.micButton, micStatus === 'listening' && styles.micButtonActive]}
          onPress={handleMic}
        >
          <Text style={styles.micButtonText}>{micStatus === 'listening' ? '⏹' : '🎙️'}</Text>
        </Pressable>
        <TextInput
          style={styles.textInput}
          placeholder="영어로 메시지를 입력해보세요"
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable style={styles.sendButton} onPress={handleSend} disabled={isSending}>
          <Text style={styles.sendButtonText}>보내기</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 22, fontWeight: '700', color: colors.text },
  helper: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  keySetupBlock: { padding: spacing.lg, paddingTop: spacing.xl },
  keyHint: { fontSize: 13, color: colors.textMuted, marginTop: spacing.md, lineHeight: 19 },
  keyInput: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  errorText: { color: colors.danger, marginTop: spacing.sm, fontSize: 13 },
  saveKeyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveKeyButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  topBarLeft: { flex: 1 },
  linkText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  topicChip: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  topicChipText: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  resetChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  resetChipText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  messages: { flex: 1 },
  messagesContent: { padding: spacing.lg, paddingTop: spacing.xs, gap: spacing.sm },
  noteBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  bubble: {
    maxWidth: '85%',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  bubbleModel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  bubbleUserText: { color: '#fff', fontSize: 15, lineHeight: 21 },
  bubbleModelText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  speakButton: { marginTop: spacing.xs, alignSelf: 'flex-start' },
  speakButtonText: { fontSize: 16 },
  errorBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: { color: colors.danger, fontSize: 12, flex: 1, marginRight: spacing.sm },
  retryText: { color: colors.danger, fontWeight: '700', fontSize: 12 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: { backgroundColor: colors.primary },
  micButtonText: { fontSize: 18 },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sendButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
