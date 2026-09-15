import React, { createContext, useContext, useState, useEffect } from 'react';
import { EditorSettings } from '../types';

interface EditorSettingsContextType {
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: EditorSettings = {
  fontSize: 14,
  tabSize: 4,
  wordWrap: true,
  autoFormatOnSave: true,
  theme: 'vs-dark',
  lineNumbers: true,
};

const EditorSettingsContext = createContext<EditorSettingsContextType | undefined>(undefined);

export const EditorSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<EditorSettings>(() => {
    const saved = localStorage.getItem('codenest_editor_settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('codenest_editor_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <EditorSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </EditorSettingsContext.Provider>
  );
};

export const useEditorSettings = () => {
  const context = useContext(EditorSettingsContext);
  if (!context) throw new Error('useEditorSettings must be used within an EditorSettingsProvider');
  return context;
};
