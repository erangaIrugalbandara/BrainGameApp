// src/screens/MainMenuScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import CoachIntroOverlay from '../components/CoachIntroOverlay';
import PlayfulBackground from '../components/PlayfulBackground';
import { getUserName, saveUserName } from '../utils/storage';
import { THEME } from '../utils/theme';

export default function MainMenuScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [showIntro, setShowIntro] = useState(false);
  const [introName, setIntroName] = useState('');
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const name = await getUserName();
      setUserName(name || 'Player');
      setIntroName(name || '');
      setShowIntro(!name);
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true
    }).start();
  }, [entrance]);

  const cardStyle = (index: number) => ({
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [24 + index * 6, 0]
        })
      }
    ]
  });

  const handleIntroContinue = async () => {
    const trimmed = introName.trim();
    if (!trimmed.length) return;
    await saveUserName(trimmed);
    setUserName(trimmed);
    setShowIntro(false);
  };

  return (
    <PlayfulBackground variant="mint" contentStyle={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Main Menu</Text>
          <Text style={styles.title}>Hey {userName}!</Text>
          <Text style={styles.subtitle}>Choose your next focus sprint.</Text>
        </View>

        <Animated.View style={[styles.card, styles.cardBlue, cardStyle(0)]}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Game1Menu')}>
            <View style={styles.cardTop}>
              <View style={styles.iconBubble}>
                <Text style={styles.iconText}>123</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Number Search</Text>
            <Text style={styles.cardDescription}>Find numbers 1 to 25 with speed and accuracy.</Text>
            <Text style={styles.cardCta}>Play now</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardPink, cardStyle(1)]}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Game2Menu')}>
            <View style={styles.cardTop}>
              <View style={styles.iconBubble}>
                <Text style={styles.iconText}>Aa</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Stroop Test</Text>
            <Text style={styles.cardDescription}>Tap the color of the word, not the word itself.</Text>
            <Text style={styles.cardCta}>Play now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <CoachIntroOverlay
        visible={showIntro}
        name={introName}
        onChangeName={setIntroName}
        onContinue={handleIntroContinue}
      />
    </PlayfulBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 20,
    paddingTop: 10
  },
  container: {
    flex: 1
  },
  header: {
    marginBottom: 20
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
    fontSize: 32,
    color: THEME.colors.ink
  },
  subtitle: {
    fontFamily: THEME.fonts.body,
    fontSize: 16,
    color: THEME.colors.muted,
    marginTop: 6
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: 18,
    marginBottom: 16,
    ...THEME.shadow
  },
  cardBlue: {
    backgroundColor: '#E8F3FF'
  },
  cardPink: {
    backgroundColor: '#FFE6F1'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    fontFamily: THEME.fonts.display,
    fontSize: 16,
    color: THEME.colors.ink
  },
  cardTitle: {
    fontFamily: THEME.fonts.display,
    fontSize: 20,
    marginTop: 14,
    color: THEME.colors.ink
  },
  cardDescription: {
    fontFamily: THEME.fonts.body,
    fontSize: 14,
    color: THEME.colors.muted,
    marginTop: 6,
    lineHeight: 20
  },
  cardCta: {
    fontFamily: THEME.fonts.display,
    fontSize: 14,
    color: THEME.colors.primaryDark,
    marginTop: 12,
    letterSpacing: 0.5
  }
});
