import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing } from 'react-native';
import PlayfulBackground from '../components/PlayfulBackground';
import { saveGameRecord } from '../utils/storage';
import { THEME } from '../utils/theme';

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
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.max(0, timeLeft / timeLimit),
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  }, [progressAnim, timeLeft, timeLimit]);

  const endGame = async () => {
    setIsPlaying(false);
    await saveGameRecord(2, score, level);
    Alert.alert('Time Up!', `You scored ${score} points.`, [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const handlePress = (selectedColor: string) => {
    if (!isPlaying) return;
    if (selectedColor === currentChallenge.color) {
      setScore((s) => s + 1);
    }
    setCurrentChallenge(getRandomColors());
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });
  const isEasy = level === 'Easy';

  return (
    <PlayfulBackground variant="berry" contentStyle={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{level}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Score</Text>
            <Text style={styles.infoValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.timerCard}>
          <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>{timeLeft}s</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </View>

        <View style={styles.challengeCard}>
          <Text style={styles.challengeLabel}>Pick the text color</Text>
          <Text style={[styles.word, { color: COLOR_CODES[currentChallenge.color] }]}>{currentChallenge.word}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                isEasy ? { backgroundColor: COLOR_CODES[color] } : styles.neutralButton
              ]}
              onPress={() => handlePress(color)}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, !isEasy && styles.neutralButtonText]}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>

    </PlayfulBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 16,
    paddingTop: 8
  },
  container: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 140,
    ...THEME.shadow
  },
  infoLabel: {
    fontFamily: THEME.fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    color: THEME.colors.muted,
    marginBottom: 4
  },
  infoValue: {
    fontFamily: THEME.fonts.display,
    fontSize: 18,
    color: THEME.colors.ink
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginBottom: 16,
    ...THEME.shadow
  },
  timerText: {
    fontFamily: THEME.fonts.display,
    fontSize: 32,
    color: THEME.colors.ink,
    marginBottom: 10
  },
  timerWarning: {
    color: THEME.colors.danger
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#EEF2F7',
    borderRadius: 999,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.lg,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 18,
    ...THEME.shadow
  },
  challengeLabel: {
    fontFamily: THEME.fonts.body,
    fontSize: 14,
    color: THEME.colors.muted,
    marginBottom: 6
  },
  word: {
    fontFamily: THEME.fonts.display,
    fontSize: 48,
    textTransform: 'uppercase'
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  colorButton: {
    width: '47%',
    paddingVertical: 14,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
    ...THEME.shadow
  },
  buttonText: {
    fontFamily: THEME.fonts.display,
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.5
  },
  neutralButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME.colors.outline
  },
  neutralButtonText: {
    color: THEME.colors.ink
  },
  exitButton: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: THEME.colors.outline,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 6,
    ...THEME.shadow
  },
  exitText: {
    fontFamily: THEME.fonts.display,
    fontSize: 12,
    color: THEME.colors.ink,
    letterSpacing: 0.5
  }
});
