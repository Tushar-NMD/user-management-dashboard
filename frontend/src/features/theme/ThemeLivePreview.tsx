import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useTheme } from '../../theme/useTheme';
import { Check, Sparkles, Send, Shield } from 'lucide-react';

export const ThemeLivePreview: React.FC = () => {
  const { tokens, config } = useTheme();
  const [sampleInput, setSampleInput] = useState('alex.turner@company.com');
  const [sampleLoading, setSampleLoading] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-400" />
            <span>Interactive Live Component Sandbox</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            These live elements consume the exact design tokens currently applied to the application.
          </p>
        </div>

        <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
          Token: {tokens.primary}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Buttons Suite */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Button Variants & States
          </span>
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setSampleLoading(true);
                  setTimeout(() => setSampleLoading(false), 1500);
                }}
                loading={sampleLoading}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Primary Accent
              </Button>
              <Button variant="secondary">Secondary</Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>

        {/* Input & Focus Rings */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Form Controls & Focus Ring
          </span>
          <div className="space-y-3">
            <Input
              label="Interactive Text Field"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              showClear
              onClear={() => setSampleInput('')}
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="preview-checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-indigo-600 focus:ring-2 focus:ring-offset-1 cursor-pointer"
                style={{ accentColor: tokens.primary }}
              />
              <label
                htmlFor="preview-checkbox"
                className="text-xs text-slate-700 font-medium cursor-pointer"
              >
                Accent-aware checkbox control
              </label>
            </div>
          </div>
        </div>

        {/* Badges & Navigation States */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Badges & Navigation Token
          </span>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Theme Accent</Badge>
              <Badge status="Active" />
              <Badge status="Inactive" />
              <Badge role="Admin" />
            </div>

            {/* Simulated Active Nav Item */}
            <div
              className="px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs font-semibold select-none border"
              style={{
                backgroundColor: tokens.primaryLight,
                color: tokens.primary,
                borderColor: tokens.primaryRing,
              }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Simulated Active Navigation</span>
              </div>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Specimen */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-slate-700">Active Font Family: </span>
          <span className="font-mono text-slate-500">
            {config.customFont ? config.customFont.name : 'Plus Jakarta Sans (Default Stack)'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Heading 600</span>
          <span>•</span>
          <span>Body 400</span>
          <span>•</span>
          <span>Contrast: {tokens.primaryContrast}</span>
        </div>
      </div>
    </div>
  );
};
