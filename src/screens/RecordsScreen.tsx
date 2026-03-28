import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PlayfulBackground from '../components/PlayfulBackground';
import { retrieveGameRecords } from '../utils/storage';
import { THEME } from '../utils/theme';

interface GameRecord {
  date: string;
  score: number;
  level: string;
}

export default function RecordsScreen({ route, navigation }: any) {
  const { gameId } = route.params;
  const [records, setRecords] = useState<GameRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await retrieveGameRecords(gameId);
      data.sort((a: GameRecord, b: GameRecord) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(data);
    };
    fetchRecords();
  }, [gameId]);

  const renderItem = ({ item }: { item: GameRecord }) => (
    <View style={styles.recordItem}>
      <View>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
        </Text>
        <Text style={styles.levelText}>Level: {item.level}</Text>
      </View>
      <View style={styles.scorePill}>
        <Text style={styles.scoreText}>{gameId === 1 ? `${item.score}s` : `${item.score} pts`}</Text>
      </View>
    </View>
  );

  return (
    <PlayfulBackground variant="mint" contentStyle={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>History</Text>
          <Text style={styles.title}>Records</Text>
          <Text style={styles.subtitle}>{gameId === 1 ? 'Number Search' : 'Stroop Test'}</Text>
        </View>

        {records.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No games yet</Text>
            <Text style={styles.emptyText}>Play a round to start your record board.</Text>
          </View>
        ) : (
          <FlatList
            data={records}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </PlayfulBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 20
  },
  container: {
    flex: 1
  },
  header: {
    marginBottom: 18
  },
  eyebrow: {
    fontFamily: THEME.fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: THEME.colors.muted,
    marginBottom: 6
  },
  title: {
    fontFamily: THEME.fonts.display,
    fontSize: 30,
    color: THEME.colors.ink
  },
  subtitle: {
    fontFamily: THEME.fonts.body,
    fontSize: 15,
    color: THEME.colors.muted,
    marginTop: 6
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.lg,
    padding: 20,
    ...THEME.shadow
  },
  emptyTitle: {
    fontFamily: THEME.fonts.display,
    fontSize: 18,
    color: THEME.colors.ink,
    marginBottom: 6
  },
  emptyText: {
    fontFamily: THEME.fonts.body,
    fontSize: 14,
    color: THEME.colors.muted,
    lineHeight: 20
  },
  list: {
    flex: 1
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: THEME.radius.lg,
    marginBottom: 12,
    ...THEME.shadow
  },
  dateText: {
    fontFamily: THEME.fonts.body,
    fontSize: 12,
    color: THEME.colors.muted,
    marginBottom: 4
  },
  levelText: {
    fontFamily: THEME.fonts.display,
    fontSize: 16,
    color: THEME.colors.primaryDark
  },
  scorePill: {
    backgroundColor: '#F1F5FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  scoreText: {
    fontFamily: THEME.fonts.display,
    fontSize: 16,
    color: THEME.colors.ink
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: THEME.colors.outline
  },
  backText: {
    fontFamily: THEME.fonts.display,
    fontSize: 14,
    color: THEME.colors.ink
  }
});
