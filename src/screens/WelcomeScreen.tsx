// src/screens/WelcomeScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import PlayfulBackground from '../components/PlayfulBackground';
import { saveUserName } from '../utils/storage';
import { THEME } from '../utils/theme';

export default function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const heroAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [heroAnim]);

  const handleStart = async () => {
    if (name.trim()) {
      await saveUserName(name);
      navigation.replace('MainMenu');
    }
  };

  return (
    <PlayfulBackground variant="sunset" contentStyle={styles.safe}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnim,
              transform: [
                {
                  translateY: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.eyebrow}>Welcome</Text>
          <Text style={styles.title}>Brain Games</Text>
          <Text style={styles.subtitle}>Play quick challenges that boost focus and speed.</Text>
        </Animated.View>

        <View style={styles.card}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your name"
            placeholderTextColor="rgba(27, 30, 40, 0.4)"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={[styles.primaryButton, !name.trim() && styles.primaryButtonDisabled]}
            onPress={handleStart}
            disabled={!name.trim()}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>Start Training</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>2 games</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Daily streaks</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Quick sessions</Text>
          </View>
        </View>
      </View>
    </PlayfulBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  hero: {
    marginBottom: 24
  },
  eyebrow: {
    fontFamily: THEME.fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    color: THEME.colors.muted,
    textTransform: 'uppercase',
    marginBottom: 8
  },
  title: {
    fontFamily: THEME.fonts.display,
    fontSize: 38,
    color: THEME.colors.ink,
    marginBottom: 8
  },
  subtitle: {
    fontFamily: THEME.fonts.body,
    fontSize: 16,
    color: THEME.colors.muted,
    lineHeight: 22
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: 20,
    ...THEME.shadow
  },
  label: {
    fontFamily: THEME.fonts.body,
    fontSize: 14,
    color: THEME.colors.muted,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: THEME.colors.outline,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: THEME.fonts.body,
    fontSize: 16,
    color: THEME.colors.ink,
    backgroundColor: '#F9FAFB',
    marginBottom: 16
  },
  primaryButton: {
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radius.md,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryButtonDisabled: {
    opacity: 0.6
  },
  primaryButtonText: {
    fontFamily: THEME.fonts.display,
    color: '#fff',
    fontSize: 16,
    letterSpacing: 0.5
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(27, 30, 40, 0.08)'
  },
  chipText: {
    fontFamily: THEME.fonts.body,
    fontSize: 12,
    color: THEME.colors.muted
  }
});
