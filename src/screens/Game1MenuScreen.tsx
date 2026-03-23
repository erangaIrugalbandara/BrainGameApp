// src/screens/Game1MenuScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LEVELS = [
  { name: 'Easy', time: 75 },
  { name: 'Medium', time: 60 },
  { name: 'Hard', time: 30 },
  { name: 'Impossible', time: 15 },
];

export default function Game1MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number Search</Text>
      <Text style={styles.instructions}>Find the numbers from 1 to 25 in order as fast as possible.</Text>
      
      <Text style={styles.levelHeader}>Select a Difficulty Level</Text>
      {LEVELS.map((level) => (
        <TouchableOpacity
          key={level.name}
          style={styles.levelButton}
          onPress={() => navigation.navigate('Game1', { level: level.name, timeLimit: level.time })}
        >
          <Text style={styles.levelText}>{level.name}</Text>
          <Text style={styles.timeText}>{level.time}s</Text>
        </TouchableOpacity>
      ))}
      
      <View style={{height: 20}} />
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Records', { gameId: 1 })}>
         <Text style={styles.navButtonText}>View Records</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navButton, {backgroundColor: '#777'}]} onPress={() => navigation.goBack()}>
         <Text style={styles.navButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  instructions: { fontSize: 16, textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  levelHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  levelButton: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', backgroundColor: '#007BFF', padding: 15, borderRadius: 10, marginBottom: 10 },
  levelText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  timeText: { color: 'white', fontSize: 16 },
  navButton: { width: '80%', backgroundColor: '#28a745', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  navButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
