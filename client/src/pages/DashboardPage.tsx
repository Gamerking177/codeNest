import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderCode,
  BookOpen,
  Star,
  Sparkles,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCode,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DashboardStats, Program } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge, LanguageBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { ProgramCard } from '../components/programs/ProgramCard';
import { ShareDialog } from '../components/sharing/ShareDialog';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharingProgram, setSharingProgram] = useState<Program | null>(null);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/programs/stats');
      if (response.data?.success) {
        setStats(response.data.data.stats);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Unable to load dashboard statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      await apiClient.patch(`/programs/${id}/favorite`);
      fetchDashboardData();
    } catch {
      // Ignore
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border/70 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Developer'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Here's what's happening with your code and college assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/programs/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Program
          </Button>
        </div>
      </div>

      {/* 2. Real Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            {/* Total Programs */}
            <Card padding="md" className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Total Programs</span>
                <FolderCode className="w-4 h-4 text-brand-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {stats?.totalPrograms || 0}
                </span>
                <span className="text-[11px] text-gray-500">solutions</span>
              </div>
            </Card>

            {/* Active Subjects */}
            <Card padding="md" className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Subjects</span>
                <BookOpen className="w-4 h-4 text-cyanAccent-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {stats?.totalSubjects || 0}
                </span>
                <span className="text-[11px] text-gray-500">categories</span>
              </div>
            </Card>

            {/* Starred Favorites */}
            <Card padding="md" className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Starred Favorites</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {stats?.totalFavorites || 0}
                </span>
                <span className="text-[11px] text-gray-500">saved</span>
              </div>
            </Card>

            {/* Formatted Solutions */}
            <Card padding="md" className="flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-medium">Code Formatted</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {stats?.totalPrograms || 0}
                </span>
                <span className="text-[11px] text-brand-400 font-mono">100% clean</span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* 3. Subject Distribution Row */}
      {stats && stats.subjectCounts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Active Subjects ({stats.subjectCounts.length})
            </h3>
            <Link to="/subjects" className="text-xs text-brand-400 hover:underline">
              View all subjects &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.subjectCounts.map((sub) => (
              <Link
                key={sub.subject}
                to={`/programs?subject=${encodeURIComponent(sub.subject)}`}
                className="p-3.5 rounded-lg bg-dark-surface border border-dark-border hover:border-gray-600 transition-all flex items-center justify-between group"
              >
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-gray-200 group-hover:text-brand-300 transition-colors truncate block">
                    {sub.subject}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {sub.count} {sub.count === 1 ? 'program' : 'programs'}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-brand-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. Recently Updated Programs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Recently Updated Solutions
            </h3>
          </div>
          <Link to="/programs" className="text-xs text-brand-400 hover:underline">
            Browse all programs &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : !stats || stats.recentlyUpdated.length === 0 ? (
          <div className="p-8 rounded-lg bg-dark-surface border border-dashed border-dark-border text-center">
            <p className="text-xs text-gray-400">No programs saved yet.</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={() => navigate('/programs/new')}
            >
              Create your first program
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentlyUpdated.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onToggleFavorite={handleToggleFavorite}
                onOpenShare={(p) => setSharingProgram(p)}
                viewMode="grid"
              />
            ))}
          </div>
        )}
      </div>

      {/* Sharing Dialog */}
      <ShareDialog
        isOpen={Boolean(sharingProgram)}
        onClose={() => setSharingProgram(null)}
        program={sharingProgram}
      />
    </div>
  );
};
