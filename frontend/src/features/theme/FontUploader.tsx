import React, { useRef, useState } from 'react';
import { Upload, Type, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

interface FontUploaderProps {
  onSuccessNotice?: (msg: string) => void;
}

// Local font assets served by the application
const SAMPLE_FONTS = [
  {
    name: 'Trebuchet MS',
    fileName: 'trebuchet.ttf',
    format: 'truetype' as const,
    url: '/fonts/trebuchet.ttf',
    description: 'Humanist geometric sans-serif',
  },
  {
    name: 'Consolas',
    fileName: 'consolas.ttf',
    format: 'truetype' as const,
    url: '/fonts/consolas.ttf',
    description: 'Crisp developer monospace',
  },
];

export const FontUploader: React.FC<FontUploaderProps> = ({ onSuccessNotice }) => {
  const { config, uploadFont, removeCustomFont } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setUploading(true);
    setErrorMsg(null);

    const result = await uploadFont(file);
    setUploading(false);

    if (result.success) {
      if (onSuccessNotice) onSuccessNotice(`Font "${file.name}" registered and applied globally!`);
    } else {
      setErrorMsg(result.error || 'Failed to apply uploaded font.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  // Instant demo font loader for testing
  const handleLoadSampleFont = async (sample: typeof SAMPLE_FONTS[0]) => {
    try {
      setUploading(true);
      setErrorMsg(null);
      const res = await fetch(sample.url);
      if (!res.ok) throw new Error('Could not fetch sample font');
      const blob = await res.blob();
      const file = new File([blob], sample.fileName, { type: 'font/ttf' });
      await processFile(file);
    } catch (err: unknown) {
      setUploading(false);
      const msg = err instanceof Error ? err.message : 'Error loading sample font';
      setErrorMsg(msg);
    }
  };

  const handleRemove = () => {
    removeCustomFont();
    setErrorMsg(null);
    if (onSuccessNotice) onSuccessNotice('Custom font removed. Default system font restored.');
  };

  const hasCustomFont = Boolean(config.customFont);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <span>Global Typography Upload</span>
          {hasCustomFont && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          )}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload a custom font file (.woff2, .woff, .ttf, or .otf) up to 2.5 MB to dynamically rebrand the entire dashboard interface.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf,application/font-woff,application/x-font-woff,application/x-font-truetype,application/x-font-opentype"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Drop Zone */}
      {!hasCustomFont ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group ${isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
            }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
            {uploading ? <Spinner size="sm" /> : <Upload className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              {uploading ? 'Processing & registering font...' : 'Click to browse or drag & drop font file here'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports .woff2, .woff, .ttf, .otf (Max 2.5 MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Font Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 w-full min-w-0">
            {/* <div className="flex items-center gap-3"> */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {config.customFont?.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-600">
                    {config.customFont?.format}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Size: {config.customFont ? formatFileSize(config.customFont.sizeBytes) : '—'} •
                  Uploaded: {config.customFont ? formatDate(config.customFont.uploadedAt) : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                icon={<Upload className="w-3.5 h-3.5" />}
              >
                Replace
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemove}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Live Preview Specimen */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1.5 border-b border-slate-100">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Active Global Typography Specimen
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Applied to Entire Dashboard
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-xl font-bold text-slate-900 tracking-tight">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pack my box with five dozen liquor jugs. Jackdaws love my big sphinx of quartz. 1234567890
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Sample Fonts */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-medium text-[11px] uppercase tracking-wider">
            Quick-Test Sample Fonts:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_FONTS.map((font) => (
            <button
              key={font.name}
              type="button"
              disabled={uploading}
              onClick={() => handleLoadSampleFont(font)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
              title={`Load sample ${font.name}`}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
