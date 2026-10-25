import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { ThemePresetId } from '../../types/theme';

export const PresetSelector: React.FC = () => {
  const { config, presets, setPreset } = useTheme();

  const isCustomColorActive = Boolean(config.customColor);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Brand Color Presets</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select a curated, accessible color palette to update your primary interactive elements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {(Object.keys(presets) as ThemePresetId[]).map((id) => {
          const preset = presets[id];
          const isSelected = !isCustomColorActive && config.preset === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all relative cursor-pointer select-none ${
                isSelected
                  ? 'bg-white shadow-xs'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200'
              }`}
              style={{
                borderColor: isSelected ? preset.primary : undefined,
                boxShadow: isSelected ? `0 0 0 2px ${preset.ring}` : undefined,
              }}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center shadow-2xs"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
                </div>

                <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {preset.primary}
                </span>
              </div>

              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                {preset.name}
                {isSelected && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
