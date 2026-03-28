import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type VariantName = 'mint' | 'sunset' | 'berry' | 'sky';

const VARIANTS: Record<VariantName, { base: string; blob1: string; blob2: string; blob3: string; ribbon: string }> = {
  mint: {
    base: '#E9FFF5',
    blob1: '#B8F2E6',
    blob2: '#FFDCE8',
    blob3: '#FFF1B8',
    ribbon: '#CDE7FF'
  },
  sunset: {
    base: '#FFF2E3',
    blob1: '#FFD1A6',
    blob2: '#FFB3C1',
    blob3: '#C7B7FF',
    ribbon: '#FFE9A8'
  },
  berry: {
    base: '#F5ECFF',
    blob1: '#D6C6FF',
    blob2: '#FFCAD4',
    blob3: '#BEE1FF',
    ribbon: '#FFE29A'
  },
  sky: {
    base: '#ECF6FF',
    blob1: '#CDE9FF',
    blob2: '#FFD9EC',
    blob3: '#FFF3B8',
    ribbon: '#BDE0FE'
  }
};

type Props = {
  children: React.ReactNode;
  variant?: VariantName;
  contentStyle?: ViewStyle;
};

export default function PlayfulBackground({ children, variant = 'mint', contentStyle }: Props) {
  const palette = VARIANTS[variant] ?? VARIANTS.mint;

  return (
    <View style={[styles.container, { backgroundColor: palette.base }]}>
      <View pointerEvents="none" style={[styles.ribbon, { backgroundColor: palette.ribbon }]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobOne, { backgroundColor: palette.blob1 }]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobTwo, { backgroundColor: palette.blob2 }]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobThree, { backgroundColor: palette.blob3 }]} />
      <View pointerEvents="none" style={styles.dots} />
      <SafeAreaView style={[styles.safe, contentStyle]}>{children}</SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safe: {
    flex: 1
  },
  ribbon: {
    position: 'absolute',
    top: 24,
    right: -40,
    width: 200,
    height: 40,
    borderRadius: 20,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.7
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.7
  },
  blobOne: {
    width: 220,
    height: 220,
    top: -40,
    left: -80
  },
  blobTwo: {
    width: 180,
    height: 180,
    bottom: -60,
    right: -40
  },
  blobThree: {
    width: 140,
    height: 140,
    bottom: 120,
    left: -30
  },
  dots: {
    position: 'absolute',
    top: 120,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(27, 30, 40, 0.1)'
  }
});
