import React from 'react';
import { Keyboard } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const ShortcutsPage: React.FC = () => {
  const shortcutGroups = [
    {
      group: 'Global Navigation',
      items: [
        { key: 'Ctrl + K / Cmd + K', action: 'Open Command Palette and Global Program Search' },
        { key: 'Esc', action: 'Dismiss active dialogs, modal sheets, and search overlays' },
      ],
    },
    {
      group: 'Monaco Editor Workspace',
      items: [
        { key: 'Ctrl + S / Cmd + S', action: 'Save current solution and run automatic code formatter' },
        { key: 'Ctrl + F / Cmd + F', action: 'Find text within solution source code' },
        { key: 'Ctrl + H / Cmd + H', action: 'Replace text within solution source code' },
        { key: 'Alt + Z', action: 'Toggle word wrap mode within active editor' },
      ],
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Keyboard className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Keyboard Shortcuts</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Quick key combinations to operate your CodeNest workspace at terminal speed.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {shortcutGroups.map((grp) => (
          <div key={grp.group} className="space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
              {grp.group}
            </h3>

            <Card padding="none" className="divide-y divide-dark-border overflow-hidden">
              {grp.items.map((item) => (
                <div
                  key={item.key}
                  className="px-4 py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <span className="text-gray-300 font-medium">{item.action}</span>
                  <kbd className="font-mono text-[11px] text-brand-300 bg-dark-panel px-2.5 py-1 rounded border border-dark-border shrink-0 shadow-xs">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
