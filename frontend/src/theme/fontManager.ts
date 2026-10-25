import { CustomFont } from '../types/theme';

const STYLE_ELEMENT_ID = 'userflow-custom-font-style';
export const CUSTOM_FONT_FAMILY_NAME = 'UserflowCustomFont';
export const MAX_FONT_SIZE_BYTES = 2.5 * 1024 * 1024; // 2.5MB

const FORMAT_MAP: Record<string, CustomFont['format']> = {
  woff2: 'woff2',
  woff: 'woff',
  ttf: 'truetype',
  otf: 'opentype',
};

export function validateFontFile(file: File): { valid: boolean; error?: string; format?: CustomFont['format'] } {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !FORMAT_MAP[extension]) {
    return {
      valid: false,
      error: 'Invalid file format. Supported formats: .woff2, .woff, .ttf, .otf',
    };
  }

  if (file.size > MAX_FONT_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Font file is too large (${sizeMb} MB). Maximum size is 2.5 MB.`,
    };
  }

  return {
    valid: true,
    format: FORMAT_MAP[extension],
  };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Error reading font file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Registers font dynamically in the document head and native FontFace API
 */
export async function applyCustomFontFace(font: CustomFont): Promise<void> {
  try {
    // 1. Create or update dynamic style tag with multiple weight rules so headers and bold text match
    let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ELEMENT_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: 800;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: '${CUSTOM_FONT_FAMILY_NAME}';
        src: url('${font.dataUrl}') format('${font.format}'), url('${font.dataUrl}');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
      }
    `;

    // 2. Also register natively in document.fonts
    if (typeof FontFace !== 'undefined' && 'fonts' in document) {
      try {
        const fontFace = new FontFace(CUSTOM_FONT_FAMILY_NAME, `url(${font.dataUrl})`);
        const loadedFace = await fontFace.load();
        document.fonts.add(loadedFace);
      } catch (fontErr) {
        console.warn('FontFace API parse warning:', fontErr);
      }
    }
  } catch (err) {
    console.error('Failed to inject custom font-face rule:', err);
  }
}

/**
 * Removes custom font-face from DOM and document.fonts
 */
export function removeCustomFontFace(): void {
  const styleEl = document.getElementById(STYLE_ELEMENT_ID);
  if (styleEl) {
    styleEl.remove();
  }

  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      document.fonts.forEach((font) => {
        if (font.family === CUSTOM_FONT_FAMILY_NAME) {
          document.fonts.delete(font);
        }
      });
    } catch {
      // ignore
    }
  }
}
