// src/screens/WelcomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveUserName } from '../utils/storage';

export default function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleStart = async () => {
    if (name.trim()) {
      await saveUserName(name);
      navigation.replace('MainMenu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Brain Games!</Text>
      <Text style={styles.subtitle}>Enter your name to start training your brain.</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Start" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  input: { width: '80%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 20 },
});
