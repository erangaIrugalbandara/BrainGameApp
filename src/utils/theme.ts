import { Platform } from 'react-native';

export const THEME = {
  colors: {
    ink: '#1B1E28',
    muted: '#5E6472',
    card: '#FFFFFF',
    outline: '#E6E8EF',
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    accent: '#FF7A59',
    accentDark: '#F05D3E',
    good: '#22C55E',
    warn: '#F59E0B',
    danger: '#EF4444'
  },
  fonts: {
    display: Platform.select({
      ios: 'AvenirNext-Heavy',
      android: 'sans-serif-condensed',
      default: 'AvenirNext-Heavy'
    }),
    body: Platform.select({
      ios: 'AvenirNext-Regular',
      android: 'sans-serif',
      default: 'AvenirNext-Regular'
    }),
    mono: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'Menlo'
    })
  },
  radius: {
    xl: 28,
    lg: 20,
    md: 14,
    sm: 10,
    xs: 6
  },
  shadow: {
    shadowColor: '#10131A',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
  }
};
