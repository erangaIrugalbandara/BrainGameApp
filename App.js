import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './src/screens/WelcomeScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import Game1MenuScreen from './src/screens/Game1MenuScreen';
import Game1Screen from './src/screens/Game1Screen';
import Game2MenuScreen from './src/screens/Game2MenuScreen';
import Game2Screen from './src/screens/Game2Screen';
import RecordsScreen from './src/screens/RecordsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainMenu" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="Game1Menu" component={Game1MenuScreen} />
          <Stack.Screen name="Game1" component={Game1Screen} />
          <Stack.Screen name="Game2Menu" component={Game2MenuScreen} />
          <Stack.Screen name="Game2" component={Game2Screen} />
          <Stack.Screen name="Records" component={RecordsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
