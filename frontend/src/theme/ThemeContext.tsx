import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ThemeContext } from './ThemeContextDefinition';
import {
  CustomFont,
  ThemeConfig,
  ThemeContextValue,
  ThemePresetId,
  ThemeTokens,
} from '../types/theme';
import {
  darkenHex,
  getContrastTextColor,
  hexToRgbaString,
  isValidHex,
  lightenHex,
  normalizeHex,
} from './colorUtils';
import {
  applyCustomFontFace,
  CUSTOM_FONT_FAMILY_NAME,
  readFileAsDataUrl,
  removeCustomFontFace,
  validateFontFile,
} from './fontManager';
import {
  saveFontToStorage,
  getFontFromStorage,
  deleteFontFromStorage,
} from './fontStorage';
import { DEFAULT_FONT_STACK, THEME_PRESETS } from './themeTokens';

const STORAGE_KEY = 'userflow_theme_config';

const DEFAULT_CONFIG: ThemeConfig = {
  preset: 'indigo',
  customColor: null,
  customFont: null,
};

function loadSavedConfig(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);

    const preset =
      parsed.preset && (THEME_PRESETS[parsed.preset as ThemePresetId] || parsed.preset === 'custom')
        ? parsed.preset
        : 'indigo';

    const customColor =
      parsed.customColor && isValidHex(parsed.customColor)
        ? normalizeHex(parsed.customColor)
        : null;

    return {
      preset,
      customColor,
      customFont: null, // hydrated asynchronously from persistent fontStorage
    };
  } catch (err) {
    console.warn('Failed to load theme configuration from localStorage, using defaults.', err);
    return DEFAULT_CONFIG;
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => loadSavedConfig());

  // Hydrate custom font from persistent storage on startup
  useEffect(() => {
    let mounted = true;
    getFontFromStorage()
      .then((storedFont) => {
        if (!mounted || !storedFont) return;
        applyCustomFontFace(storedFont);
        setConfig((prev) => ({ ...prev, customFont: storedFont }));
      })
      .catch((err) => {
        console.warn('Failed to hydrate font from storage:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Compute design tokens based on current config
  const tokens = useMemo<ThemeTokens>(() => {
    let primary = THEME_PRESETS.indigo.primary;
    let primaryHover = THEME_PRESETS.indigo.hover;
    let primaryLight = THEME_PRESETS.indigo.light;
    let primaryRing = THEME_PRESETS.indigo.ring;
    let primaryContrast = THEME_PRESETS.indigo.contrastText;

    if (config.customColor && isValidHex(config.customColor)) {
      primary = normalizeHex(config.customColor);
      primaryHover = darkenHex(primary, 0.12);
      primaryLight = lightenHex(primary, 0.92);
      primaryRing = hexToRgbaString(primary, 0.25);
      primaryContrast = getContrastTextColor(primary);
    } else {
      const activePreset =
        config.preset in THEME_PRESETS
          ? THEME_PRESETS[config.preset as ThemePresetId]
          : THEME_PRESETS.indigo;

      primary = activePreset.primary;
      primaryHover = activePreset.hover;
      primaryLight = activePreset.light;
      primaryRing = activePreset.ring;
      primaryContrast = activePreset.contrastText;
    }

    const fontFamily = config.customFont
      ? `'${CUSTOM_FONT_FAMILY_NAME}', ${DEFAULT_FONT_STACK}`
      : DEFAULT_FONT_STACK;

    return {
      primary,
      primaryHover,
      primaryLight,
      primaryRing,
      primaryContrast,
      fontFamily,
    };
  }, [config]);

  // Apply CSS variables and font-face to the DOM
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', tokens.primary);
    root.style.setProperty('--color-primary-hover', tokens.primaryHover);
    root.style.setProperty('--color-primary-light', tokens.primaryLight);
    root.style.setProperty('--color-primary-ring', tokens.primaryRing);
    root.style.setProperty('--color-primary-contrast', tokens.primaryContrast);
    root.style.setProperty('--app-font-family', tokens.fontFamily);
    root.style.setProperty('--font-sans', tokens.fontFamily);

    if (config.customFont) {
      void applyCustomFontFace(config.customFont);
    } else {
      removeCustomFontFace();
    }
  }, [tokens, config.customFont]);

  // Persist preset and custom color to localStorage
  const persistConfig = useCallback((newConfig: ThemeConfig) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preset: newConfig.preset,
          customColor: newConfig.customColor,
        })
      );
    } catch (err: unknown) {
      console.warn('Failed to save theme configuration to localStorage:', err);
    }
  }, []);

  const setPreset = useCallback((presetId: ThemePresetId) => {
    setConfig((prev) => {
      const next: ThemeConfig = {
        ...prev,
        preset: presetId,
        customColor: null,
      };
      persistConfig(next);
      return next;
    });
  }, [persistConfig]);

  const setCustomColor = useCallback((hex: string): boolean => {
    if (!isValidHex(hex)) return false;
    const clean = normalizeHex(hex);
    setConfig((prev) => {
      const next: ThemeConfig = {
        ...prev,
        preset: 'custom',
        customColor: clean,
      };
      persistConfig(next);
      return next;
    });
    return true;
  }, [persistConfig]);

  const resetCustomColor = useCallback(() => {
    setConfig((prev) => {
      const next: ThemeConfig = {
        ...prev,
        preset: 'indigo',
        customColor: null,
      };
      persistConfig(next);
      return next;
    });
  }, [persistConfig]);

  const uploadFont = useCallback(async (file: File): Promise<{ success: boolean; error?: string }> => {
    const validation = validateFontFile(file);
    if (!validation.valid || !validation.format) {
      return { success: false, error: validation.error };
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const customFont: CustomFont = {
        name: file.name,
        dataUrl,
        format: validation.format,
        sizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
      };

      // 1. Immediately apply to DOM
      await applyCustomFontFace(customFont);

      // 2. Persist to persistent storage (IndexedDB)
      await saveFontToStorage(customFont);

      // 3. Update React state
      setConfig((prev) => ({
        ...prev,
        customFont,
      }));

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process font file';
      return { success: false, error: message };
    }
  }, []);

  const removeCustomFont = useCallback(async () => {
    removeCustomFontFace();
    await deleteFontFromStorage();
    setConfig((prev) => ({
      ...prev,
      customFont: null,
    }));
  }, []);

  const resetAllTheme = useCallback(async () => {
    removeCustomFontFace();
    await deleteFontFromStorage();
    setConfig(DEFAULT_CONFIG);
    persistConfig(DEFAULT_CONFIG);
  }, [persistConfig]);

  const value = useMemo<ThemeContextValue>(() => ({
    config,
    tokens,
    activePresetId: config.customColor ? 'custom' : (config.preset as ThemePresetId),
    setPreset,
    setCustomColor,
    resetCustomColor,
    uploadFont,
    removeCustomFont,
    resetAllTheme,
    presets: THEME_PRESETS,
  }), [
    config,
    tokens,
    setPreset,
    setCustomColor,
    resetCustomColor,
    uploadFont,
    removeCustomFont,
    resetAllTheme,
  ]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
