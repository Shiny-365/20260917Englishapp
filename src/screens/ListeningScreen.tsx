import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { WORDS } from '../data/words';
import type { Word } from '../types/word';
import { useSpeak } from '../hooks/useSpeak';
import { useProgressContext } from '../context/ProgressContext';
import { pickRandom, shuffle } from '../utils/random';
import { colors, radius, spacing } from '../theme';

type Round = {
  word: Word;
  choices: Word[];
};

function buildRound(): Round {
  const word = pickRandom(WORDS, 1)[0];
  const distractors = pickRandom(
    WORDS.filter((w) => w.id !== word.id),
    3
  );
  return { word, choices: shuffle([word, ...distractors]) };
}

export default function ListeningScreen() {
  const { speak } = useSpeak();
  const { recordResult } = useProgressContext();
  const [round, setRound] = useState<Round>(() => buildRound());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const playWord = useCallback((rate?: number) => {
    speak(round.word.text, rate);
  }, [round.word, speak]);

  useEffect(() => {
    playWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.word.id]);

  const handleSelect = (choice: Word) => {
    if (selectedId) return;
    setSelectedId(choice.id);
    recordResult(round.word.id, choice.id === round.word.id);
  };

  const nextRound = () => {
    setSelectedId(null);
    setRound(buildRound());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>🎧 듣기 연습</Text>
      <Text style={styles.helper}>단어를 듣고 알맞은 뜻을 골라보세요</Text>

      <View style={styles.playCard}>
        <Pressable style={styles.playButton} onPress={() => playWord()}>
          <Text style={styles.playButtonText}>🔊 다시 듣기</Text>
        </Pressable>
        <Pressable style={styles.slowButton} onPress={() => playWord(0.5)}>
          <Text style={styles.slowButtonText}>🐢 천천히 듣기</Text>
        </Pressable>
      </View>

      <View style={styles.choices}>
        {round.choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isAnswer = choice.id === round.word.id;
          const showState = selectedId !== null;
          return (
            <Pressable
              key={choice.id}
              onPress={() => handleSelect(choice)}
              style={[
                styles.choiceButton,
                showState && isAnswer && styles.choiceCorrect,
                showState && isSelected && !isAnswer && styles.choiceWrong,
              ]}
            >
              <Text style={styles.choiceText}>{choice.meaning}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedId && (
        <View style={styles.feedbackBlock}>
          <Text
            style={[
              styles.feedbackText,
              { color: selectedId === round.word.id ? colors.success : colors.danger },
            ]}
          >
            {selectedId === round.word.id ? '정답이에요! 🎉' : `아쉬워요. 정답은 "${round.word.meaning}"`}
          </Text>
          <Text style={styles.exampleText}>{round.word.text} — {round.word.example}</Text>
          <Pressable style={styles.nextButton} onPress={nextRound}>
            <Text style={styles.nextButtonText}>다음 문제 →</Text>
          </Pressable>
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
  playCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  playButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  playButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  slowButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  slowButtonText: { color: colors.text, fontWeight: '600', fontSize: 15 },
  choices: { gap: spacing.sm },
  choiceButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  choiceCorrect: { backgroundColor: '#E6F7EF', borderColor: colors.success },
  choiceWrong: { backgroundColor: '#FCEBEC', borderColor: colors.danger },
  choiceText: { fontSize: 16, color: colors.text, fontWeight: '600' },
  feedbackBlock: { marginTop: spacing.lg, alignItems: 'center' },
  feedbackText: { fontSize: 17, fontWeight: '700', marginBottom: spacing.xs },
  exampleText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md },
  nextButton: {
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  nextButtonText: { color: '#fff', fontWeight: '700' },
});
