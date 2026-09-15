import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  LayoutDashboard,
  FolderCode,
  BookOpen,
  Star,
  Settings,
  HelpCircle,
  FileCode,
  X,
  ArrowRight,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { Program } from '../../types';
import { LanguageBadge } from '../ui/Badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Default quick commands
  const defaultCommands = [
    { id: 'new-program', label: 'Create New Program', icon: Plus, action: () => navigate('/programs/new') },
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard') },
    { id: 'programs', label: 'Browse All Programs', icon: FolderCode, action: () => navigate('/programs') },
    { id: 'subjects', label: 'Browse Subjects', icon: BookOpen, action: () => navigate('/subjects') },
    { id: 'favorites', label: 'View Starred Favorites', icon: Star, action: () => navigate('/favorites') },
    { id: 'settings', label: 'Editor & Workspace Settings', icon: Settings, action: () => navigate('/settings') },
    { id: 'docs', label: 'Read Documentation', icon: HelpCircle, action: () => navigate('/docs') },
  ];

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setPrograms([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search for programs from API
  useEffect(() => {
    if (!query.trim()) {
      setPrograms([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/programs?search=${encodeURIComponent(query.trim())}&limit=5`);
        if (response.data?.success) {
          setPrograms(response.data.data.programs || []);
        }
      } catch {
        setPrograms([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const filteredCommands = defaultCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const totalItems = filteredCommands.length + programs.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % (totalItems || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredCommands.length) {
          filteredCommands[selectedIndex]?.action();
          onClose();
        } else {
          const programIndex = selectedIndex - filteredCommands.length;
          const targetProg = programs[programIndex];
          if (targetProg) {
            navigate(`/programs/${targetProg.id}`);
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems, filteredCommands, programs, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-dark-surface border border-dark-border rounded-lg shadow-modal overflow-hidden transition-all duration-150 animate-in fade-in zoom-in-95">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-dark-border gap-2.5">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search programs, subjects, or commands..."
            className="w-full bg-transparent text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline font-mono text-[10px] bg-dark-panel px-1.5 py-0.5 rounded border border-dark-border text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {/* Matching Programs Section */}
          {programs.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-2 py-1">
                Programs ({programs.length})
              </div>
              {programs.map((program, idx) => {
                const isSelected = selectedIndex === filteredCommands.length + idx;
                return (
                  <div
                    key={program.id}
                    onClick={() => {
                      navigate(`/programs/${program.id}`);
                      onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand-500/15 text-brand-300' : 'text-gray-200 hover:bg-dark-panel'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCode className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium truncate">{program.title}</span>
                      <span className="text-gray-500 font-mono text-[11px] truncate">{program.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <LanguageBadge language={program.language} />
                      <ArrowRight className="w-3 h-3 text-gray-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Commands Section */}
          {filteredCommands.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-2 py-1 mt-1">
                Commands
              </div>
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand-500/15 text-brand-300' : 'text-gray-200 hover:bg-dark-panel'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{cmd.label}</span>
                    </div>
                    {isSelected && (
                      <kbd className="font-mono text-[10px] text-brand-400">↵</kbd>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-xs text-gray-400">
              No matching programs or commands found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-dark-panel/60 border-t border-dark-border flex items-center justify-between text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>CodeNest Command Engine</span>
        </div>
      </div>
    </div>
  );
};
