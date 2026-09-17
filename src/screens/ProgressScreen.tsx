import React from 'react';
import { StyleSheet, Text, View, SectionList, Pressable, Alert } from 'react-native';
import { CATEGORY_LABELS, WORDS } from '../data/words';
import type { WordCategory } from '../types/word';
import { useProgressContext } from '../context/ProgressContext';
import { getWordProgress, summarize } from '../storage/progress';
import { colors, radius, spacing } from '../theme';

export default function ProgressScreen() {
  const { progress, reset } = useProgressContext();
  const stats = summarize(progress);

  const sections = (Object.keys(CATEGORY_LABELS) as WordCategory[]).map((category) => ({
    title: CATEGORY_LABELS[category],
    data: WORDS.filter((w) => w.category === category),
  }));

  const confirmReset = () => {
    Alert.alert('학습 기록 초기화', '모든 학습 기록을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => reset() },
    ]);
  };

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <Text style={styles.header}>📊 학습 진행 상황</Text>
          <View style={styles.statsRow}>
            <Stat label="전체" value={stats.total} />
            <Stat label="완전히 익힘" value={stats.mastered} color={colors.success} />
            <Stat label="학습 중" value={stats.inProgress} color={colors.primary} />
            <Stat label="시작 전" value={stats.notStarted} color={colors.textMuted} />
          </View>
          <Pressable style={styles.resetButton} onPress={confirmReset}>
            <Text style={styles.resetButtonText}>학습 기록 초기화</Text>
          </Pressable>
        </View>
      }
      renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
      renderItem={({ item }) => {
        const p = getWordProgress(progress, item.id);
        const badge = p.mastered ? '완료' : p.totalAttempts > 0 ? `${p.correctStreak}/3` : '-';
        return (
          <View style={styles.wordRow}>
            <View>
              <Text style={styles.wordText}>{item.text}</Text>
              <Text style={styles.meaningText}>{item.meaning}</Text>
            </View>
            <View
              style={[
                styles.badge,
                p.mastered && styles.badgeMastered,
                !p.mastered && p.totalAttempts > 0 && styles.badgeInProgress,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  (p.mastered || p.totalAttempts > 0) && styles.badgeTextActive,
                ]}
              >
                {badge}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  header: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: spacing.xs },
  resetButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xs,
  },
  resetButtonText: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  wordText: { fontSize: 16, fontWeight: '700', color: colors.text },
  meaningText: { fontSize: 13, color: colors.textMuted },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  badgeMastered: { backgroundColor: '#E6F7EF' },
  badgeInProgress: { backgroundColor: '#E9EDFF' },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  badgeTextActive: { color: colors.text },
});
