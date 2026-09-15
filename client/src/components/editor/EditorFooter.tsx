import React from 'react';

interface EditorFooterProps {
  cursorPosition: { line: number; column: number };
  language: string;
  tabSize?: number;
  readOnly?: boolean;
}

export const EditorFooter: React.FC<EditorFooterProps> = ({
  cursorPosition,
  language,
  tabSize = 4,
  readOnly = false,
}) => {
  return (
    <footer className="flex items-center justify-between px-3 py-1 bg-dark-panel border-t border-dark-border text-[11px] font-mono text-gray-400 select-none">
      <div className="flex items-center gap-4">
        <span>
          Ln <span className="text-gray-200">{cursorPosition.line}</span>, Col{' '}
          <span className="text-gray-200">{cursorPosition.column}</span>
        </span>
        <span className="hidden sm:inline">Spaces: {tabSize}</span>
        <span className="hidden sm:inline">UTF-8</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="uppercase text-brand-400">{language}</span>
        {readOnly && (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
            READ ONLY
          </span>
        )}
      </div>
    </footer>
  );
};
