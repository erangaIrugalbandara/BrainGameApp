import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing } from 'react-native';
import PlayfulBackground from '../components/PlayfulBackground';
import { saveGameRecord } from '../utils/storage';
import { THEME } from '../utils/theme';

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
  const gridScale = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setGrid(generateGrid());
    Animated.spring(gridScale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true
    }).start();
  }, [gridScale]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.max(0, timeLeft / timeLimit),
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  }, [progressAnim, timeLeft, timeLimit]);

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      Alert.alert('Time Up!', 'You ran out of time.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPlaying, navigation]);

  const handlePress = async (num: number) => {
    if (!isPlaying || num !== currentNum) return;

    if (num === 25) {
      setIsPlaying(false);
      const timeTaken = timeLimit - timeLeft;
      await saveGameRecord(1, timeTaken, level);
      Alert.alert('Nice work!', `You finished in ${timeTaken} seconds.`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      setCurrentNum(currentNum + 1);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <PlayfulBackground variant="sky" contentStyle={styles.safe}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Level</Text>
            <Text style={styles.pillValue}>{level}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Target</Text>
            <Text style={styles.pillValue}>{currentNum}</Text>
          </View>
        </View>

        <View style={styles.timerCard}>
          <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>{timeLeft}s</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </View>

        <Animated.View style={[styles.grid, { transform: [{ scale: gridScale }] }]}>
          {grid.map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.cell, num < currentNum && styles.cellHidden]}
              onPress={() => handlePress(num)}
              disabled={num < currentNum}
              activeOpacity={0.9}
            >
              <Text style={[styles.cellText, num < currentNum && styles.cellTextHidden]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 140,
    ...THEME.shadow
  },
  pillLabel: {
    fontFamily: THEME.fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    color: THEME.colors.muted,
    marginBottom: 4
  },
  pillValue: {
    fontFamily: THEME.fonts.display,
    fontSize: 18,
    color: THEME.colors.ink
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginBottom: 14,
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
    backgroundColor: THEME.colors.primary
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: THEME.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 6,
    ...THEME.shadow
  },
  cell: {
    width: 54,
    height: 54,
    margin: 5,
    backgroundColor: '#FF8C66',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14
  },
  cellHidden: {
    backgroundColor: '#E3E8F0'
  },
  cellText: {
    fontFamily: THEME.fonts.display,
    fontSize: 20,
    color: '#FFFFFF'
  },
  cellTextHidden: {
    color: '#8A94A6'
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
