import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Share2,
  Edit,
  Trash2,
  BookMarked,
  FileQuestion,
  HelpCircle,
  Clock,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Program } from '../types';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SaveStatus } from '../components/editor/EditorToolbar';
import { Badge, LanguageBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { ShareDialog } from '../components/sharing/ShareDialog';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [program, setProgram] = useState<Program | null>(null);
  const [code, setCode] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [activeLeftTab, setActiveLeftTab] = useState<'problem' | 'notes'>('problem');
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Auto-save debounce timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProgram = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/programs/${id}`);
      if (response.data?.success && response.data?.data?.program) {
        const prog: Program = response.data.data.program;
        setProgram(prog);
        setCode(prog.code);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Program not found or access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgram();
  }, [id]);

  // Persist code changes
  const saveProgramCode = useCallback(
    async (codeToSave?: string) => {
      const targetCode = codeToSave ?? code;
      if (!id || !program) return;
      setSaveStatus('saving');
      try {
        await apiClient.patch(`/programs/${id}`, {
          code: targetCode,
        });
        setSaveStatus('saved');
        setProgram((prev) => (prev ? { ...prev, code: targetCode, updatedAt: new Date().toISOString() } : null));
      } catch {
        setSaveStatus('error');
        toast.error('Failed to auto-save changes.');
      }
    },
    [id, program, code, toast]
  );

  // Handle live code edits with debounced autosave
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setSaveStatus('unsaved');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveProgramCode(newCode);
    }, 1200);
  };

  const handleToggleFavorite = async () => {
    if (!program) return;
    try {
      await apiClient.patch(`/programs/${program.id}/favorite`);
      setProgram((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
      toast.success(program.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Unable to update favorite status.');
    }
  };

  const handleDelete = async () => {
    if (!program) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/programs/${program.id}`);
      toast.success('Program successfully deleted.');
      navigate('/programs');
    } catch {
      toast.error('Unable to delete program.');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchProgram} />;
  }

  if (isLoading || !program) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-7">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Workspace Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-surface border border-dark-border rounded-lg p-3 sm:px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded hover:bg-dark-panel transition-colors ${
              program.isFavorite ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
            }`}
            title={program.isFavorite ? 'Starred Favorite' : 'Star Favorite'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight truncate">
              {program.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span className="text-brand-400 font-semibold">{program.subject}</span>
              <span>&middot;</span>
              <span className="uppercase">{program.language}</span>
              <span>&middot;</span>
              <span className="text-gray-500">
                {new Date(program.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsShareDialogOpen(true)}
            leftIcon={<Share2 className="w-3.5 h-3.5 text-brand-400" />}
          >
            Share
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/programs/${program.id}/edit`)}
            leftIcon={<Edit className="w-3.5 h-3.5" />}
          >
            Edit Info
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
            title="Delete Program"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main 40/60 Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
        {/* Left 40% Column: Problem Statement & Personal Notes Tabs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Tabs Selector */}
          <div className="flex items-center gap-1 bg-dark-surface border border-dark-border rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveLeftTab('problem')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded font-medium transition-colors ${
                activeLeftTab === 'problem'
                  ? 'bg-dark-panel text-white border border-dark-border/80 shadow-subtle'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5 text-brand-400" />
              <span>Problem Statement</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('notes')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded font-medium transition-colors ${
                activeLeftTab === 'notes'
                  ? 'bg-dark-panel text-white border border-dark-border/80 shadow-subtle'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span>Personal Notes</span>
            </button>
          </div>

          {/* Tab 1: Problem / Question */}
          {activeLeftTab === 'problem' && (
            <div className="flex-1 bg-dark-surface border border-dark-border rounded-lg p-5 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
                    Assignment Challenge
                  </span>
                  <LanguageBadge language={program.language} />
                </div>

                <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap font-normal">
                  {program.question ? (
                    program.question
                  ) : (
                    <span className="text-gray-500 italic">
                      No question provided for this assignment. Click "Edit Info" to add problem requirements.
                    </span>
                  )}
                </div>
              </div>

              {/* Tags list */}
              {program.tags.length > 0 && (
                <div className="pt-4 border-t border-dark-border">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {program.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-dark-panel border border-dark-border text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Personal Notes & Observations */}
          {activeLeftTab === 'notes' && (
            <div className="flex-1 bg-dark-surface border border-dark-border rounded-lg p-5 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    Lab Notes & Edge Cases
                  </span>
                  <button
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    {isNotesExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {isNotesExpanded && (
                  <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {program.notes ? (
                      program.notes
                    ) : (
                      <span className="text-gray-500 italic">
                        No notes yet. Click "Edit Info" to record complexity notes, professor hints, or edge cases.
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-dark-panel/60 border border-dark-border text-[11px] text-gray-400 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-cyanAccent-500 shrink-0 mt-0.5" />
                <span>
                  Tip: Changes made to the code editor in the right pane are debounced and automatically saved.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right 60% Column: Monaco Code Editor */}
        <div className="lg:col-span-7 flex flex-col">
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            language={program.language}
            onSave={saveProgramCode}
            saveStatus={saveStatus}
            minHeight="620px"
          />
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        program={program}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Program"
        message={`Are you sure you want to permanently delete "${program.title}"? This action cannot be undone.`}
        confirmText="Delete Program"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
