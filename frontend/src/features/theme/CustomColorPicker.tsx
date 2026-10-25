import React, { useState } from 'react';
import { Pipette, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import {
  getContrastTextColor,
  isValidHex,
  normalizeHex,
} from '../../theme/colorUtils';
import { Button } from '../../components/ui/Button';

interface CustomColorPickerProps {
  onSuccessNotice?: (msg: string) => void;
}

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ onSuccessNotice }) => {
  const { config, tokens, setCustomColor, resetCustomColor } = useTheme();

  const currentHex = config.customColor || tokens.primary;
  const [internalHex, setInternalHex] = useState<string | null>(null);

  const hexInput = internalHex ?? currentHex;
  const isValid = isValidHex(hexInput);

  const handleInputChange = (val: string) => {
    const formatted = val.startsWith('#') ? val : `#${val}`;
    setInternalHex(formatted);
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setInternalHex(val);
    setCustomColor(val);
    if (onSuccessNotice) onSuccessNotice(`Applied custom accent color ${val}`);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidHex(hexInput)) return;

    const normalized = normalizeHex(hexInput);
    setCustomColor(normalized);
    setInternalHex(null);
    if (onSuccessNotice) onSuccessNotice(`Custom accent color updated to ${normalized}`);
  };

  const handleReset = () => {
    resetCustomColor();
    setInternalHex(null);
    if (onSuccessNotice) onSuccessNotice('Reset primary accent to default preset');
  };

  const contrastText = isValidHex(hexInput) ? getContrastTextColor(hexInput) : '#FFFFFF';
  const isCustomActive = Boolean(config.customColor);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span>Custom Accent Color</span>
          {isCustomActive && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active
            </span>
          )}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose any brand color via the color picker or enter a valid hexadecimal string.
        </p>
      </div>

      <form onSubmit={handleApply} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Visual Picker & Swatch */}
          <div className="relative flex items-center">
            <label
              htmlFor="native-color-picker"
              className="w-11 h-10 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105 overflow-hidden"
              style={{ backgroundColor: isValidHex(hexInput) ? hexInput : tokens.primary }}
              title="Click to open system color picker"
            >
              <Pipette
                className="w-4 h-4"
                style={{
                  color: isValidHex(hexInput)
                    ? getContrastTextColor(hexInput)
                    : '#FFFFFF',
                }}
              />
            </label>
            <input
              id="native-color-picker"
              type="color"
              value={isValidHex(hexInput) ? normalizeHex(hexInput) : '#4F46E5'}
              onChange={handleNativePickerChange}
              className="sr-only"
            />
          </div>

          {/* Hex Input */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#4F46E5"
                maxLength={7}
                className={`w-full font-mono text-sm uppercase px-3.5 py-2 rounded-lg border bg-white transition-all theme-ring-focus ${
                  !isValid
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              {isValidHex(hexInput) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              )}
            </div>
            {!isValid && (
              <p className="text-xs text-red-600 mt-1">Please enter a valid hex color (e.g. #2563EB)</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || hexInput === config.customColor}
              size="md"
            >
              Apply Color
            </Button>

            {isCustomActive && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleReset}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset to Preset
              </Button>
            )}
          </div>
        </div>

        {/* Real-time Accessibility & Contrast Feedback */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-600">
              WCAG 2.1 Contrast Engine: Button text color automatically set to{' '}
              <strong className="text-slate-900 font-semibold">
                {contrastText === '#FFFFFF' ? 'White (#FFFFFF)' : 'Dark Slate (#0F172A)'}
              </strong>
            </span>
          </div>

          {/* Dynamic Miniature Button Preview */}
          <div
            className="px-3 py-1 rounded-md text-xs font-semibold shrink-0 text-center shadow-2xs select-none"
            style={{
              backgroundColor: isValidHex(hexInput) ? hexInput : tokens.primary,
              color: contrastText,
            }}
          >
            Button Preview
          </div>
        </div>
      </form>
    </div>
  );
};
