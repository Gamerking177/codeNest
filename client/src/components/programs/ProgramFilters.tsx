import React from 'react';
import { Search, LayoutGrid, List, Filter, Star } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../editor/EditorToolbar';

interface ProgramFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  subjectsList: string[];
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  isFavoriteOnly: boolean;
  onFavoriteOnlyChange: (fav: boolean) => void;
  sortBy: 'updatedAt' | 'createdAt' | 'title';
  onSortChange: (sort: 'updatedAt' | 'createdAt' | 'title') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ProgramFilters: React.FC<ProgramFiltersProps> = ({
  search,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  subjectsList,
  selectedLanguage,
  onLanguageChange,
  isFavoriteOnly,
  onFavoriteOnlyChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-lg bg-dark-surface border border-dark-border mb-6">
      {/* Search and View Mode Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search programs by title, problem, or tags..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-panel text-gray-100 placeholder:text-gray-500 text-xs rounded-lg border border-dark-border pl-9 pr-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-dark-panel border border-dark-border rounded-lg p-1 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-dark-surface text-brand-400 shadow-subtle'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-dark-surface text-brand-400 shadow-subtle'
                : 'text-gray-400 hover:text-white'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Row: Subject, Language, Favorite, Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-dark-border/60 text-xs text-gray-300">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="bg-dark-panel border border-dark-border rounded px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="">All Subjects</option>
            {subjectsList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-dark-panel border border-dark-border rounded px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-brand-500 font-medium font-mono"
          >
            <option value="">All Languages</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          {/* Favorite Toggle */}
          <button
            onClick={() => onFavoriteOnlyChange(!isFavoriteOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
              isFavoriteOnly
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-dark-panel border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavoriteOnly ? 'fill-current text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-dark-panel border border-dark-border rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="updatedAt">Recently Updated</option>
            <option value="createdAt">Recently Created</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
