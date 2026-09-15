import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { EditorToolbar, SaveStatus } from './EditorToolbar';
import { EditorFooter } from './EditorFooter';
import { FormatterService } from '../../services/FormatterService';
import { useEditorSettings } from '../../context/EditorSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export interface CodeEditorProps {
  code: string;
  onChange?: (newCode: string) => void;
  language: string;
  onLanguageChange?: (newLanguage: string) => void;
  onSave?: (formattedCode?: string) => Promise<void> | void;
  saveStatus?: SaveStatus;
  readOnly?: boolean;
  minHeight?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onSave,
  saveStatus = 'saved',
  readOnly = false,
  minHeight = '360px',
}) => {
  const { settings, updateSettings } = useEditorSettings();
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });

  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map application language to Monaco language identifier
  const getMonacoLanguage = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'c' || l === 'cpp') return 'cpp';
    if (l === 'python' || l === 'py') return 'python';
    if (l === 'java') return 'java';
    if (l === 'sql') return 'sql';
    if (l === 'typescript' || l === 'ts') return 'typescript';
    if (l === 'javascript' || l === 'js') return 'javascript';
    if (l === 'html') return 'html';
    if (l === 'css') return 'css';
    if (l === 'json') return 'json';
    if (l === 'go') return 'go';
    if (l === 'rust') return 'rust';
    return 'plaintext';
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Custom dark theme tuning for CodeNest
    monaco.editor.defineTheme('codenest-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc' },
        { token: 'string', foreground: '86efac' },
        { token: 'number', foreground: 'fde047' },
        { token: 'type', foreground: '67e8f9' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e5e7eb',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#10b981',
        'editor.lineHighlightBackground': '#161b22',
        'editorCursor.foreground': '#34d399',
        'editor.selectionBackground': '#10b98133',
      },
    });

    if (resolvedTheme === 'dark') {
      monaco.editor.setTheme('codenest-dark');
    } else {
      monaco.editor.setTheme('vs');
    }
  };

  // Synchronize theme changes
  useEffect(() => {
    if ((window as any).monaco) {
      (window as any).monaco.editor.setTheme(resolvedTheme === 'dark' ? 'codenest-dark' : 'vs');
    }
  }, [resolvedTheme]);

  // Format code action
  const handleFormat = useCallback(async () => {
    if (!code || isFormatting) return;
    setIsFormatting(true);
    try {
      const formatted = await FormatterService.format(code, language);
      if (formatted !== code && onChange) {
        onChange(formatted);
      }
      return formatted;
    } catch {
      toast.error('Code formatting was skipped due to syntax warning.');
      return code;
    } finally {
      setIsFormatting(false);
    }
  }, [code, language, isFormatting, onChange, toast]);

  // Save + Format on Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        let codeToSave = code;
        if (settings.autoFormatOnSave && !readOnly) {
          const formatted = await handleFormat();
          if (formatted) codeToSave = formatted;
        }
        if (onSave) {
          await onSave(codeToSave);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, settings.autoFormatOnSave, readOnly, handleFormat, onSave]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col border border-dark-border rounded-lg overflow-hidden bg-[#0d1117] ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen'
          : 'w-full'
      }`}
      style={!isFullscreen ? { minHeight } : undefined}
    >
      {/* Editor Toolbar */}
      <EditorToolbar
        language={language}
        onLanguageChange={onLanguageChange}
        onFormat={handleFormat}
        isFormatting={isFormatting}
        code={code}
        wordWrap={settings.wordWrap}
        onToggleWordWrap={() => updateSettings({ wordWrap: !settings.wordWrap })}
        fontSize={settings.fontSize}
        onFontSizeChange={(fontSize) => updateSettings({ fontSize })}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        saveStatus={saveStatus}
        readOnly={readOnly}
      />

      {/* Monaco Editor Canvas */}
      <div className="flex-1 relative min-h-[300px]">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(val) => onChange && onChange(val || '')}
          onMount={handleEditorMount}
          theme={resolvedTheme === 'dark' ? 'codenest-dark' : 'vs'}
          options={{
            readOnly,
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            wordWrap: settings.wordWrap ? 'on' : 'off',
            lineNumbers: settings.lineNumbers ? 'on' : 'off',
            minimap: { enabled: isFullscreen },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', Consolas, Monaco, monospace",
            fontLigatures: true,
            formatOnPaste: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>

      {/* Editor Status Footer */}
      <EditorFooter
        cursorPosition={cursorPos}
        language={language}
        tabSize={settings.tabSize}
        readOnly={readOnly}
      />
    </div>
  );
};
