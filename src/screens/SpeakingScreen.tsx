import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { WORDS } from '../data/words';
import type { Word } from '../types/word';
import { useSpeak } from '../hooks/useSpeak';
import { useSpeechRecognizer } from '../hooks/useSpeechRecognizer';
import { useProgressContext } from '../context/ProgressContext';
import { isPronunciationMatch } from '../utils/textMatch';
import { pickRandom } from '../utils/random';
import { colors, radius, spacing } from '../theme';

type Result = { transcript: string; isCorrect: boolean };

export default function SpeakingScreen() {
  const { speak } = useSpeak();
  const { recordResult } = useProgressContext();
  const { status, transcript, errorMessage, start, stop } = useSpeechRecognizer();
  const [word, setWord] = useState<Word>(() => pickRandom(WORDS, 1)[0]);
  const [result, setResult] = useState<Result | null>(null);

  const isListening = status === 'listening';

  const handleStart = () => {
    setResult(null);
    start((finalTranscript) => {
      const isCorrect = isPronunciationMatch(word.text, finalTranscript);
      setResult({ transcript: finalTranscript, isCorrect });
      recordResult(word.id, isCorrect);
    });
  };

  const nextWord = () => {
    setResult(null);
    setWord(pickRandom(WORDS, 1)[0]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>🎤 말하기 연습</Text>
      <Text style={styles.helper}>단어를 듣고 똑같이 소리내어 말해보세요</Text>

      <View style={styles.wordCard}>
        <Text style={styles.wordText}>{word.text}</Text>
        <Text style={styles.meaningText}>{word.meaning}</Text>
        <Text style={styles.exampleText}>{word.example}</Text>

        <Pressable style={styles.listenButton} onPress={() => speak(word.text)}>
          <Text style={styles.listenButtonText}>🔊 들어보기</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPress={isListening ? stop : handleStart}
      >
        {isListening ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.micButtonText}>🎙️ 말하기 시작</Text>
        )}
      </Pressable>
      {isListening && <Text style={styles.listeningHint}>듣고 있어요... "{transcript}"</Text>}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {result && (
        <View style={styles.feedbackBlock}>
          <Text style={[styles.feedbackText, { color: result.isCorrect ? colors.success : colors.danger }]}>
            {result.isCorrect ? '발음이 정확해요! 🎉' : '다시 한 번 도전해볼까요?'}
          </Text>
          <Text style={styles.transcriptText}>인식된 발음: "{result.transcript || '(인식 안됨)'}"</Text>
          <View style={styles.actionsRow}>
            <Pressable style={styles.retryButton} onPress={handleStart}>
              <Text style={styles.retryButtonText}>다시 말하기</Text>
            </Pressable>
            <Pressable style={styles.nextButton} onPress={nextWord}>
              <Text style={styles.nextButtonText}>다음 단어 →</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  header: { fontSize: 24, fontWeight: '700', color: colors.text },
  helper: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  wordCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  wordText: { fontSize: 30, fontWeight: '800', color: colors.text },
  meaningText: { fontSize: 16, color: colors.textMuted, marginTop: spacing.xs },
  exampleText: { fontSize: 13, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  listenButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  listenButtonText: { color: colors.primaryDark, fontWeight: '700' },
  micButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  micButtonActive: { backgroundColor: colors.primaryDark },
  micButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  listeningHint: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.md },
  feedbackBlock: { marginTop: spacing.lg, alignItems: 'center' },
  feedbackText: { fontSize: 17, fontWeight: '700', marginBottom: spacing.xs },
  transcriptText: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  retryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryButtonText: { color: colors.text, fontWeight: '700' },
  nextButton: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  nextButtonText: { color: '#fff', fontWeight: '700' },
});
