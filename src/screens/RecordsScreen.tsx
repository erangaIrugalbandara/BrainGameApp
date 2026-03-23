import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { retrieveGameRecords } from '../utils/storage';

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
      // Sort by date descending (newest first)
      data.sort((a: GameRecord, b: GameRecord) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(data);
    };
    fetchRecords();
  }, [gameId]);

  const renderItem = ({ item }: { item: GameRecord }) => (
    <View style={styles.recordItem}>
      <View>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}</Text>
        <Text style={styles.levelText}>Level: {item.level}</Text>
      </View>
      <View>
        <Text style={styles.scoreText}>
          {gameId === 1 ? `${item.score}s` : `${item.score} pts`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History & Records</Text>
      <Text style={styles.subtitle}>{gameId === 1 ? 'Number Search' : 'Stroop Test'}</Text>
      
      {records.length === 0 ? (
        <Text style={styles.noRecords}>No games played yet. Go play some!</Text>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#666' },
  noRecords: { textAlign: 'center', fontSize: 16, marginTop: 50, color: '#999' },
  list: { flex: 1 },
  recordItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  dateText: { fontSize: 14, color: '#555', marginBottom: 4 },
  levelText: { fontSize: 16, fontWeight: 'bold', color: '#007BFF' },
  scoreText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  backButton: { backgroundColor: '#6c757d', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  backText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
