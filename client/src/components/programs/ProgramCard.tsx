import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Share2, Code2, ArrowUpRight } from 'lucide-react';
import { Program } from '../../types';
import { Card } from '../ui/Card';
import { Badge, LanguageBadge } from '../ui/Badge';

interface ProgramCardProps {
  program: Program;
  onToggleFavorite?: (id: string) => void;
  onOpenShare?: (program: Program) => void;
  viewMode?: 'grid' | 'list';
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onToggleFavorite,
  onOpenShare,
  viewMode = 'grid',
}) => {
  const formattedDate = new Date(program.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-3.5 rounded-lg bg-dark-surface border border-dark-border hover:border-gray-600 transition-all gap-3 group">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => onToggleFavorite && onToggleFavorite(program.id)}
            className={`p-1 rounded transition-colors ${
              program.isFavorite ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'
            }`}
            title={program.isFavorite ? 'Starred Favorite' : 'Mark as Favorite'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <div className="min-w-0">
            <Link
              to={`/programs/${program.id}`}
              className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors truncate block"
            >
              {program.title}
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
              <span className="text-gray-400 font-medium">{program.subject}</span>
              <span>&middot;</span>
              <span className="font-mono text-[11px]">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageBadge language={program.language} />
          {onOpenShare && (
            <button
              onClick={() => onOpenShare(program)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-panel rounded-md transition-colors"
              title="Share Program"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <Link
            to={`/programs/${program.id}`}
            className="p-1.5 text-gray-400 hover:text-brand-300 hover:bg-dark-panel rounded-md transition-colors"
            title="Open Solution"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card
      hoverEffect
      padding="none"
      className="flex flex-col justify-between overflow-hidden group"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-dark-border bg-dark-surface flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <LanguageBadge language={program.language} />
            <span className="font-mono text-[11px] text-gray-400 truncate font-medium">
              {program.subject}
            </span>
          </div>
          <Link
            to={`/programs/${program.id}`}
            className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1"
          >
            {program.title}
          </Link>
        </div>

        <button
          onClick={() => onToggleFavorite && onToggleFavorite(program.id)}
          className={`p-1 rounded hover:bg-dark-panel transition-colors shrink-0 ${
            program.isFavorite ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'
          }`}
          title={program.isFavorite ? 'Starred Favorite' : 'Mark as Favorite'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Code preview snippet */}
      <Link to={`/programs/${program.id}`} className="p-3.5 bg-[#0a0e14] font-mono text-[11px] text-gray-400 line-clamp-3 leading-relaxed border-b border-dark-border/40 select-none block hover:text-gray-200 transition-colors">
        <code>{program.code.slice(0, 180)}</code>
      </Link>

      {/* Card Footer */}
      <div className="p-3 bg-dark-panel/40 flex items-center justify-between text-[11px] text-gray-500">
        <span className="font-mono">{formattedDate}</span>

        <div className="flex items-center gap-1.5">
          {onOpenShare && (
            <button
              onClick={() => onOpenShare(program)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-dark-surface transition-colors"
              title="Share Program Link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            to={`/programs/${program.id}`}
            className="flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>Open</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
