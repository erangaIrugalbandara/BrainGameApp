import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, Animated, Platform } from 'react-native';
import { THEME } from '../utils/theme';

type Props = {
  visible: boolean;
  name: string;
  onChangeName: (value: string) => void;
  onContinue: () => void;
};

export default function CoachIntroOverlay({ visible, name, onChangeName, onContinue }: Props) {
  const canContinue = name.trim().length > 0;
  const inputRef = useRef<TextInput>(null);
  const liftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates?.height ?? 0;
      const lift = Math.max(0, height - 40);
      Animated.timing(liftAnim, {
        toValue: -lift,
        duration: 200,
        useNativeDriver: true
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(liftAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
      inputRef.current?.blur();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [liftAnim]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View pointerEvents="none" style={styles.scrim} />
      <Animated.View style={[styles.contentLayer, { transform: [{ translateY: liftAnim }] }]}>
        <Image source={require('../../assets/character.png')} style={styles.character} resizeMode="contain" />
        <View style={styles.bubbleWrap}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleTitle}>Hi there, I'm Eranga.</Text>
            <Text style={styles.bubbleText}>Waht should I call you?</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Type your name"
              placeholderTextColor="rgba(27, 30, 40, 0.4)"
              value={name}
              onChangeText={onChangeName}
              onPressIn={() => inputRef.current?.focus()}
            />
            <Text style={styles.note}>Enjoy the game and have fun training your brain.</Text>
            <TouchableOpacity
              style={[styles.button, !canContinue && styles.buttonDisabled]}
              onPress={onContinue}
              disabled={!canContinue}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Lets Play</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bubbleTail} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 19, 26, 0.2)'
  },
  contentLayer: {
    ...StyleSheet.absoluteFillObject
  },
  character: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 260,
    height: 380
  },
  bubbleWrap: {
    position: 'absolute',
    bottom: 320,
    left: 160,
    right: 12
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    maxWidth: 300,
    ...THEME.shadow
  },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    bottom: 24,
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    borderBottomLeftRadius: 2
  },
  bubbleTitle: {
    fontFamily: THEME.fonts.display,
    fontSize: 16,
    color: THEME.colors.ink,
    marginBottom: 2
  },
  bubbleText: {
    fontFamily: THEME.fonts.body,
    fontSize: 13,
    color: THEME.colors.muted,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: THEME.colors.outline,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: THEME.fonts.body,
    fontSize: 14,
    color: THEME.colors.ink,
    backgroundColor: '#F9FAFB',
    marginBottom: 8
  },
  note: {
    fontFamily: THEME.fonts.body,
    fontSize: 11,
    color: THEME.colors.muted,
    marginBottom: 10
  },
  button: {
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radius.sm,
    paddingVertical: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    fontFamily: THEME.fonts.display,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.4
  }
});
