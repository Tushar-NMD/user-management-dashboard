export type ThemePresetId = 'indigo' | 'teal' | 'emerald' | 'violet';

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  primary: string;
  hover: string;
  light: string;
  ring: string;
  contrastText: string;
  description: string;
}

export interface CustomFont {
  name: string;
  dataUrl: string;
  format: 'woff2' | 'woff' | 'truetype' | 'opentype';
  sizeBytes: number;
  uploadedAt: string;
}

export interface ThemeConfig {
  preset: ThemePresetId | 'custom';
  customColor: string | null;
  customFont: CustomFont | null;
}

export interface ThemeTokens {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryRing: string;
  primaryContrast: string;
  fontFamily: string;
}

export interface ThemeContextValue {
  config: ThemeConfig;
  tokens: ThemeTokens;
  activePresetId: ThemePresetId | 'custom';
  setPreset: (presetId: ThemePresetId) => void;
  setCustomColor: (hex: string) => boolean;
  resetCustomColor: () => void;
  uploadFont: (file: File) => Promise<{ success: boolean; error?: string }>;
  removeCustomFont: () => void;
  resetAllTheme: () => void;
  presets: Record<ThemePresetId, ThemePreset>;
}
