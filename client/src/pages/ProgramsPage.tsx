import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, FolderCode } from 'lucide-react';
import { apiClient } from '../api/client';
import { Program, PaginationMeta } from '../types';
import { Button } from '../components/ui/Button';
import { ProgramCard } from '../components/programs/ProgramCard';
import { ProgramFilters } from '../components/programs/ProgramFilters';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { ShareDialog } from '../components/sharing/ShareDialog';

export const ProgramsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(searchParams.get('favorite') === 'true');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharingProgram, setSharingProgram] = useState<Program | null>(null);

  // Fetch distinct subjects for filter dropdown
  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await apiClient.get('/programs/subjects');
        if (res.data?.success) {
          setSubjectsList(res.data.data.subjects || []);
        }
      } catch {
        // Fallback
      }
    }
    loadSubjects();
  }, []);

  // Fetch programs whenever filters change
  const fetchPrograms = async (pageToFetch: number = 1) => {
    setIsLoading(true);
    setError(null);

    const params: Record<string, any> = {
      page: pageToFetch,
      limit: 12,
      sortBy,
      sortOrder: sortBy === 'title' ? 'asc' : 'desc',
    };

    if (search.trim()) params.search = search.trim();
    if (selectedSubject) params.subject = selectedSubject;
    if (selectedLanguage) params.language = selectedLanguage;
    if (isFavoriteOnly) params.isFavorite = true;

    try {
      const res = await apiClient.get('/programs', { params });
      if (res.data?.success) {
        setPrograms(res.data.data.programs || []);
        setPagination(res.data.data.pagination);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Unable to load programs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrograms(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedSubject, selectedLanguage, isFavoriteOnly, sortBy]);

  const handleToggleFavorite = async (id: string) => {
    try {
      await apiClient.patch(`/programs/${id}/favorite`);
      setPrograms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
      );
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Programs</h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse, search, and manage your solutions across all subjects.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/programs/new')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Program
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <ProgramFilters
        search={search}
        onSearchChange={setSearch}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        subjectsList={subjectsList}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        isFavoriteOnly={isFavoriteOnly}
        onFavoriteOnlyChange={setIsFavoriteOnly}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Program Grid / List / State */}
      {error ? (
        <ErrorState message={error} onRetry={() => fetchPrograms(pagination.page)} />
      ) : isLoading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={viewMode === 'grid' ? 'h-48 w-full' : 'h-16 w-full'} />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <EmptyState
          title={search || selectedSubject || selectedLanguage ? 'No matching programs' : 'No programs yet'}
          description={
            search || selectedSubject || selectedLanguage
              ? 'Try clearing your search query or selecting a different subject/language filter.'
              : 'Start your personal coding notebook by saving your first programming assignment.'
          }
          actionText="Create New Program"
          onAction={() => navigate('/programs/new')}
        />
      ) : (
        <div className="space-y-6">
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-2'
            }
          >
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onToggleFavorite={handleToggleFavorite}
                onOpenShare={(p) => setSharingProgram(p)}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            meta={pagination}
            onPageChange={(page) => fetchPrograms(page)}
          />
        </div>
      )}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={Boolean(sharingProgram)}
        onClose={() => setSharingProgram(null)}
        program={sharingProgram}
      />
    </div>
  );
};
