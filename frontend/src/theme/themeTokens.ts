import { ThemePreset, ThemePresetId, ThemeTokens } from '../types/theme';

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  indigo: {
    id: 'indigo',
    name: 'Indigo',
    primary: '#4F46E5',
    hover: '#4338CA',
    light: '#EEF2FF',
    ring: 'rgba(79, 70, 229, 0.25)',
    contrastText: '#FFFFFF',
    description: 'Clean modern B2B SaaS standard',
  },
  teal: {
    id: 'teal',
    name: 'Teal',
    primary: '#0D9488',
    hover: '#0F766E',
    light: '#F0FDFA',
    ring: 'rgba(13, 148, 136, 0.25)',
    contrastText: '#FFFFFF',
    description: 'Refined ocean-fresh corporate vibe',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    primary: '#16A34A',
    hover: '#15803D',
    light: '#F0FDF4',
    ring: 'rgba(22, 163, 74, 0.25)',
    contrastText: '#FFFFFF',
    description: 'Crisp, trustworthy fintech aesthetic',
  },
  violet: {
    id: 'violet',
    name: 'Violet',
    primary: '#C026D3',
    hover: '#A21CAF',
    light: '#FDF4FF',
    ring: 'rgba(192, 38, 211, 0.25)',
    contrastText: '#FFFFFF',
    description: 'Bold, innovative creative presence',
  },
};

export const DEFAULT_FONT_STACK =
  "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const DEFAULT_TOKENS: ThemeTokens = {
  primary: THEME_PRESETS.indigo.primary,
  primaryHover: THEME_PRESETS.indigo.hover,
  primaryLight: THEME_PRESETS.indigo.light,
  primaryRing: THEME_PRESETS.indigo.ring,
  primaryContrast: THEME_PRESETS.indigo.contrastText,
  fontFamily: DEFAULT_FONT_STACK,
};
