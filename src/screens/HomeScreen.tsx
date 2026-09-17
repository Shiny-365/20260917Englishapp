import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProgressContext } from '../context/ProgressContext';
import { summarize } from '../storage/progress';
import { colors, radius, spacing } from '../theme';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { progress, isLoaded } = useProgressContext();
  const stats = summarize(progress);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>English Ear 👂</Text>
      <Text style={styles.subtitle}>듣고, 말하면서 영어 단어를 익혀요</Text>

      <View style={styles.statsCard}>
        <StatItem label="전체 단어" value={stats.total} />
        <StatItem label="완전히 익힘" value={stats.mastered} highlight />
        <StatItem label="학습 중" value={stats.inProgress} />
      </View>
      {!isLoaded && <Text style={styles.loadingText}>학습 기록을 불러오는 중...</Text>}

      <Pressable
        style={[styles.card, styles.listeningCard]}
        onPress={() => navigation.navigate('Listening')}
      >
        <Text style={styles.cardEmoji}>🎧</Text>
        <Text style={styles.cardTitle}>듣기 연습</Text>
        <Text style={styles.cardDesc}>단어를 듣고 알맞은 뜻을 골라보세요</Text>
      </Pressable>

      <Pressable
        style={[styles.card, styles.speakingCard]}
        onPress={() => navigation.navigate('Speaking')}
      >
        <Text style={styles.cardEmoji}>🎤</Text>
        <Text style={styles.cardTitle}>말하기 연습</Text>
        <Text style={styles.cardDesc}>단어를 직접 소리내어 발음해보세요</Text>
      </Pressable>

      <Pressable
        style={[styles.card, styles.tutorCard]}
        onPress={() => navigation.navigate('Tutor')}
      >
        <Text style={styles.cardEmoji}>🤖</Text>
        <Text style={styles.cardTitle}>AI 튜터</Text>
        <Text style={styles.cardDesc}>오늘의 단어로 AI와 짧은 영어 대화를 나눠보세요</Text>
      </Pressable>
    </ScrollView>
  );
}

function StatItem({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, highlight && { color: colors.success }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  loadingText: { color: colors.textMuted, marginBottom: spacing.md },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  listeningCard: { backgroundColor: colors.primarySoft },
  speakingCard: { backgroundColor: colors.successSoft },
  tutorCard: { backgroundColor: colors.accentSoft },
  cardEmoji: { fontSize: 32, marginBottom: spacing.xs },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  cardDesc: { fontSize: 13, color: colors.textMuted },
});
