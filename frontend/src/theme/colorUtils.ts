/**
 * Color utility functions for custom theming engine
 */

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

export function isValidHex(hex: string): boolean {
  return HEX_COLOR_REGEX.test(hex.trim());
}

export function normalizeHex(hex: string): string {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${clean.toUpperCase()}`;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB | null {
  if (!isValidHex(hex)) return null;
  const normalized = normalizeHex(hex).slice(1);
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Calculates WCAG 2.1 relative luminance
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determines whether white or dark text is more readable based on contrast
 */
export function getContrastTextColor(hex: string): '#FFFFFF' | '#0F172A' {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#FFFFFF';
  const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  // Luminance threshold of 0.35 provides great readability for UI buttons
  return luminance > 0.35 ? '#0F172A' : '#FFFFFF';
}

/**
 * Darkens a hex color by a factor (0 to 1)
 */
export function darkenHex(hex: string, factor: number = 0.12): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = rgb.r * (1 - factor);
  const g = rgb.g * (1 - factor);
  const b = rgb.b * (1 - factor);
  return rgbToHex(r, g, b);
}

/**
 * Generates an extremely light tint (for backgrounds, badges)
 */
export function lightenHex(hex: string, factor: number = 0.92): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = rgb.r + (255 - rgb.r) * factor;
  const g = rgb.g + (255 - rgb.g) * factor;
  const b = rgb.b + (255 - rgb.b) * factor;
  return rgbToHex(r, g, b);
}

/**
 * Generates an RGBA color string for focus rings
 */
export function hexToRgbaString(hex: string, alpha: number = 0.2): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(79, 70, 229, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
