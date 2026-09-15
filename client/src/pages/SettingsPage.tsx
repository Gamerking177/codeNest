import React from 'react';
import { Moon, Sun, Laptop, Type, WrapText, Sparkles, User, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { useEditorSettings } from '../context/EditorSettingsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, resetSettings } = useEditorSettings();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleReset = () => {
    resetSettings();
    toast.success('Editor settings reset to defaults.');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage workspace appearance, editor preferences, and student account details.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono">
          Appearance
        </h3>
        <Card className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white block">Theme Mode</label>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Choose your preferred visual theme for CodeNest.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-500/10 border-brand-500 text-brand-300 shadow-subtle'
                      : 'bg-dark-panel border-dark-border text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </section>

      {/* 2. Monaco Editor Preferences */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono">
            Monaco Editor
          </h3>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-brand-300 transition-colors"
          >
            Reset defaults
          </button>
        </div>

        <Card className="divide-y divide-dark-border">
          {/* Font Size */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-white block">Font Size</span>
              <span className="text-[11px] text-gray-400">Editor text size in pixels.</span>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
              className="bg-dark-panel border border-dark-border text-gray-200 text-xs rounded px-3 py-1.5 font-mono focus:outline-none focus:border-brand-500"
            >
              {[12, 13, 14, 15, 16, 18, 20, 22].map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </select>
          </div>

          {/* Tab Size */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-white block">Tab Size</span>
              <span className="text-[11px] text-gray-400">Number of spaces per indentation level.</span>
            </div>
            <select
              value={settings.tabSize}
              onChange={(e) => updateSettings({ tabSize: Number(e.target.value) })}
              className="bg-dark-panel border border-dark-border text-gray-200 text-xs rounded px-3 py-1.5 font-mono focus:outline-none focus:border-brand-500"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces (Standard)</option>
            </select>
          </div>

          {/* Word Wrap */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-white block">Word Wrap</span>
              <span className="text-[11px] text-gray-400">Wrap long code lines inside the editor viewport.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
              className="w-4 h-4 rounded bg-dark-panel border-dark-border text-brand-500 focus:ring-brand-500"
            />
          </div>

          {/* Auto Format On Save */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-white block">Auto Format on Save (Ctrl+S)</span>
              <span className="text-[11px] text-gray-400">
                Run Prettier or language indentation beautifier whenever saving solutions.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoFormatOnSave}
              onChange={(e) => updateSettings({ autoFormatOnSave: e.target.checked })}
              className="w-4 h-4 rounded bg-dark-panel border-dark-border text-brand-500 focus:ring-brand-500"
            />
          </div>

          {/* Line Numbers */}
          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-white block">Show Line Numbers</span>
              <span className="text-[11px] text-gray-400">Display gutter line numbers for quick debugging.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.lineNumbers}
              onChange={(e) => updateSettings({ lineNumbers: e.target.checked })}
              className="w-4 h-4 rounded bg-dark-panel border-dark-border text-brand-500 focus:ring-brand-500"
            />
          </div>
        </Card>
      </section>

      {/* 3. Account Information */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider font-mono">
          Account Profile
        </h3>
        <Card className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-dark-border/60">
            <span className="text-gray-400">Full Name</span>
            <span className="text-white font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-dark-border/60">
            <span className="text-gray-400">Email Address</span>
            <span className="text-white font-mono">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-dark-border/60">
            <span className="text-gray-400">Role / Permissions</span>
            <span className="font-mono text-brand-400 uppercase font-semibold">
              {user?.role || 'USER'}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-400">College / Department</span>
            <span className="text-gray-300">{user?.college || 'Not specified'}</span>
          </div>
        </Card>
      </section>
    </div>
  );
};
