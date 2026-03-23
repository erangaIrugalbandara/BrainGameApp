import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveGameRecord } from '../utils/storage';

const generateGrid = () => {
  const nums = Array.from({ length: 25 }, (_, i) => i + 1);
  return nums.sort(() => Math.random() - 0.5);
};

export default function Game1Screen({ route, navigation }: any) {
  const { level, timeLimit } = route.params;
  const [grid, setGrid] = useState<number[]>([]);
  const [currentNum, setCurrentNum] = useState(1);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setGrid(generateGrid());
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      Alert.alert('Time Up!', 'You failed to find all numbers in time.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying]);

  const handlePress = async (num: number) => {
    if (!isPlaying || num !== currentNum) return;

    if (num === 25) {
      setIsPlaying(false);
      const timeTaken = timeLimit - timeLeft;
      await saveGameRecord(1, timeTaken, level);
      Alert.alert('Congratulations!', `You finished in ${timeTaken} seconds!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      setCurrentNum(currentNum + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Level: {level}</Text>
      <Text style={[styles.timer, timeLeft <= 10 && styles.timerWarning]}>
        Time: {timeLeft}s
      </Text>
      <Text style={styles.target}>Find: {currentNum <= 25 ? currentNum : 'Done'}</Text>
      
      <View style={styles.grid}>
        {grid.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.cell, num < currentNum && styles.cellHidden]}
            onPress={() => handlePress(num)}
            disabled={num < currentNum}
          >
            <Text style={styles.cellText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4f8' },
  header: { fontSize: 24, fontWeight: 'bold' },
  timer: { fontSize: 40, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  timerWarning: { color: 'red' },
  target: { fontSize: 22, color: '#007BFF', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 320, justifyContent: 'center' },
  cell: { width: 55, height: 55, margin: 4, backgroundColor: '#FF8C00', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  cellHidden: { backgroundColor: '#e0e0e0' },
  cellText: { fontSize: 24, fontWeight: 'bold', color: '#fff' }
});
