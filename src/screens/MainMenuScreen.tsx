// src/screens/MainMenuScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getUserName, getStreak } from '../utils/storage';

export default function MainMenuScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [game1Streak, setGame1Streak] = useState(0);
  const [game2Streak, setGame2Streak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const name = await getUserName();
      const g1Streak = await getStreak(1);
      const g2Streak = await getStreak(2);

      setUserName(name || 'Player');
      setGame1Streak(g1Streak || 0);
      setGame2Streak(g2Streak || 0);
    };
    
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {userName}!</Text>
      <Text style={styles.subtitle}>Choose your challenge</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game1Menu')}>
        <Text style={styles.buttonText}>Number Search</Text>
        <Text style={styles.streakText}>🔥 {game1Streak} days</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game2Menu')}>
        <Text style={styles.buttonText}>Stroop Test</Text>
        <Text style={styles.streakText}>🔥 {game2Streak} days</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 18, marginBottom: 30, color: '#555' },
  button: { backgroundColor: '#007BFF', width: '80%', padding: 20, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  streakText: { color: '#FFD700', fontSize: 16, marginTop: 5 },
});
