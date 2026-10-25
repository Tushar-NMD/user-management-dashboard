import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { PresetSelector } from './PresetSelector';
import { CustomColorPicker } from './CustomColorPicker';
import { FontUploader } from './FontUploader';
import { ThemeLivePreview } from './ThemeLivePreview';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui/Button';
import { Toast, ToastType } from '../../components/ui/Toast';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const ThemeSettingsPage: React.FC = () => {
  const { resetAllTheme } = useTheme();

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showNotification = (message: string, type: ToastType = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const handleResetAll = () => {
    resetAllTheme();
    setShowResetConfirm(false);
    showNotification('All theme customizations reset to default Indigo preset.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Theme Customization Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize your workspace aesthetics. All adjustments persist in client-side storage.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowResetConfirm(true)}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset All Customizations
        </Button>
      </div>

      {/* Preset Selector */}
      <PresetSelector />

      {/* Color Picker & Font Upload Side by Side / Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomColorPicker onSuccessNotice={(msg) => showNotification(msg)} />
        <FontUploader onSuccessNotice={(msg) => showNotification(msg)} />
      </div>

      {/* Live Component Sandbox */}
      <ThemeLivePreview />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All Theme Customizations?"
        message="This will restore the default Indigo preset, clear any custom hex colors, and remove custom uploaded font files."
        confirmLabel="Reset Theme"
        onConfirm={handleResetAll}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
