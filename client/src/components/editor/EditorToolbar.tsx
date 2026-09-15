import React from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  WrapText,
  Type,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface EditorToolbarProps {
  language: string;
  onLanguageChange?: (newLanguage: string) => void;
  onFormat: () => void;
  isFormatting: boolean;
  code: string;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  saveStatus?: SaveStatus;
  readOnly?: boolean;
}

export const SUPPORTED_LANGUAGES = [
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'sql', label: 'SQL' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  onLanguageChange,
  onFormat,
  isFormatting,
  code,
  wordWrap,
  onToggleWordWrap,
  fontSize,
  onFontSizeChange,
  isFullscreen,
  onToggleFullscreen,
  saveStatus = 'saved',
  readOnly = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy code to clipboard.');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-dark-panel border-b border-dark-border text-xs select-none">
      {/* Left: Language Selector & Save State */}
      <div className="flex items-center gap-3">
        {onLanguageChange && !readOnly ? (
          <div className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-dark-surface border border-dark-border text-gray-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-brand-500 font-mono"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-mono font-semibold text-brand-400">
            <span className="uppercase">{language}</span>
          </div>
        )}

        {/* Save Status Indicator */}
        {!readOnly && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded border bg-dark-surface/50 border-dark-border">
            {saveStatus === 'saved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                <span className="text-gray-300">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 text-brand-400 animate-spin" />
                <span className="text-brand-300">Saving...</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300">Unsaved changes</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-red-300">Save failed</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Controls (Format, Copy, WordWrap, Font, Fullscreen) */}
      <div className="flex items-center gap-1.5">
        {/* Auto-format Button */}
        {!readOnly && (
          <button
            onClick={onFormat}
            disabled={isFormatting}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-dark-surface hover:bg-dark-hover border border-dark-border text-gray-300 hover:text-white transition-colors"
            title="Auto-format code (Ctrl+S)"
          >
            {isFormatting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span>Format</span>
          </button>
        )}

        {/* Word Wrap Toggle */}
        <button
          onClick={onToggleWordWrap}
          className={`p-1.5 rounded transition-colors border ${
            wordWrap
              ? 'bg-brand-500/10 border-brand-500/30 text-brand-300'
              : 'bg-dark-surface border-dark-border text-gray-400 hover:text-white'
          }`}
          title={wordWrap ? 'Word Wrap: ON' : 'Word Wrap: OFF'}
        >
          <WrapText className="w-3.5 h-3.5" />
        </button>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1 bg-dark-surface border border-dark-border rounded px-1.5 py-0.5">
          <Type className="w-3 h-3 text-gray-400" />
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="bg-transparent text-[11px] font-mono text-gray-300 focus:outline-none"
            title="Editor font size"
          >
            {[12, 13, 14, 15, 16, 18, 20].map((sz) => (
              <option key={sz} value={sz} className="bg-dark-surface">
                {sz}px
              </option>
            ))}
          </select>
        </div>

        {/* Copy Code */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-dark-surface hover:bg-dark-hover border border-dark-border text-gray-300 hover:text-white transition-colors"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-brand-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded bg-dark-surface hover:bg-dark-hover border border-dark-border text-gray-400 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
