import React, { useEffect, useState } from 'react';
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

import { getUserName } from './src/utils/storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const name = await getUserName();
      setInitialRoute(name ? 'MainMenu' : 'Welcome');
    };
    checkUser();
  }, []);

  if (!initialRoute) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator id={undefined} initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
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