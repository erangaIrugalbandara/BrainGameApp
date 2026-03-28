// src/screens/Game2MenuScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PlayfulBackground from '../components/PlayfulBackground';
import { getStreak } from '../utils/storage';
import { THEME } from '../utils/theme';

const LEVELS = [
  { name: 'Easy', time: 75, color: '#E8F3FF' },
  { name: 'Medium', time: 60, color: '#FFE6F1' },
  { name: 'Hard', time: 30, color: '#FFF1B8' },
  { name: 'Impossible', time: 15, color: '#DFF7E3' }
];

export default function Game2MenuScreen({ navigation }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      const data = await getStreak(2);
      setStreak(data || 0);
    };
    const unsubscribe = navigation.addListener('focus', fetchStreak);
    return unsubscribe;
  }, [navigation]);

  return (
    <PlayfulBackground variant="berry" contentStyle={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Stroop Test</Text>
          <Text style={styles.title}>Color Clash</Text>
          <Text style={styles.instructions}>Pick the color of the text, not the word itself.</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </View>

        <View style={styles.levels}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level.name}
              style={[styles.levelCard, { backgroundColor: level.color }]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Game2', { level: level.name, timeLimit: level.time })}
            >
              <View>
                <Text style={styles.levelName}>{level.name}</Text>
              </View>
              <View style={styles.timePill}>
                <Text style={styles.timeText}>{level.time}s</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.recordButton} onPress={() => navigation.navigate('Records', { gameId: 2 })}>
          <Text style={styles.recordButtonText}>View Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </PlayfulBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 24
  },
  container: {
    flex: 1
  },
  header: {
    marginBottom: 18
  },
  streakBadge: {
    position: 'absolute',
    top: 6,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: THEME.colors.outline,
    ...THEME.shadow
  },
  streakText: {
    fontFamily: THEME.fonts.display,
    fontSize: 12,
    color: THEME.colors.ink
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
  instructions: {
    fontFamily: THEME.fonts.body,
    fontSize: 15,
    color: THEME.colors.muted,
    marginTop: 6,
    lineHeight: 22
  },
  levels: {
    marginTop: 10
  },
  levelCard: {
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...THEME.shadow
  },
  levelName: {
    fontFamily: THEME.fonts.display,
    fontSize: 18,
    color: THEME.colors.ink
  },
  levelDetail: {
    fontFamily: THEME.fonts.body,
    fontSize: 12,
    color: THEME.colors.muted,
    marginTop: 4
  },
  timePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  timeText: {
    fontFamily: THEME.fonts.mono,
    fontSize: 12,
    color: THEME.colors.ink
  },
  recordButton: {
    marginTop: 6,
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    alignItems: 'center'
  },
  recordButtonText: {
    fontFamily: THEME.fonts.display,
    fontSize: 14,
    color: '#fff'
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.outline
  },
  backButtonText: {
    fontFamily: THEME.fonts.display,
    fontSize: 14,
    color: THEME.colors.ink
  }
});
