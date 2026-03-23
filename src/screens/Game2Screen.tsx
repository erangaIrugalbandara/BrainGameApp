import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveGameRecord } from '../utils/storage';

const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
const COLOR_CODES: Record<string, string> = {
  RED: '#FF3B30',
  BLUE: '#007AFF',
  GREEN: '#28A745',
  YELLOW: '#FFC107',
  PURPLE: '#6F42C1',
  ORANGE: '#FD7E14'
};

const getRandomColors = () => {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  let color = COLORS[Math.floor(Math.random() * COLORS.length)];
  // 30% chance they are the same, 70% chance they are different
  if (Math.random() > 0.3) {
    while (color === word) {
      color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
  }
  return { word, color };
};

export default function Game2Screen({ route, navigation }: any) {
  const { level, timeLimit } = route.params;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(getRandomColors());
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying]);

  const endGame = async () => {
    setIsPlaying(false);
    await saveGameRecord(2, score, level);
    Alert.alert('Time Up!', `You scored ${score} points!`, [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handlePress = (selectedColor: string) => {
    if (!isPlaying) return;
    if (selectedColor === currentChallenge.color) {
      setScore(s => s + 1);
    } else {
      // Optional: penalize by subtracting score or just skip
    }
    setCurrentChallenge(getRandomColors());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Level: {level}</Text>
      <Text style={[styles.timer, timeLeft <= 10 && styles.timerWarning]}>
        Time: {timeLeft}s
      </Text>
      <Text style={styles.score}>Score: {score}</Text>

      <View style={styles.gameArea}>
        <Text style={[styles.word, { color: COLOR_CODES[currentChallenge.color] }]}>
          {currentChallenge.word}
        </Text>
      </View>

      <Text style={styles.instruction}>Pick the text COLOR, not the word:</Text>
      
      <View style={styles.buttonsContainer}>
        {COLORS.map(color => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: COLOR_CODES[color] }]}
            onPress={() => handlePress(color)}
          >
            <Text style={styles.buttonText}>{color}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold' },
  timer: { fontSize: 40, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  timerWarning: { color: 'red' },
  score: { fontSize: 22, color: '#007BFF', marginBottom: 20 },
  gameArea: { height: 150, justifyContent: 'center', alignItems: 'center' },
  word: { fontSize: 60, fontWeight: 'bold', textTransform: 'uppercase', textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  instruction: { fontSize: 16, marginTop: 20, marginBottom: 15, color: '#555' },
  buttonsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '90%' },
  colorButton: { width: '40%', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 }
});
