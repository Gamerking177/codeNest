import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FolderCode, ArrowRight, Plus } from 'lucide-react';
import { apiClient } from '../api/client';
import { DashboardStats } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const SubjectsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/programs/stats');
        if (res.data?.success) {
          setStats(res.data.data.stats);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadSubjects();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Subjects</h1>
          <p className="text-xs text-gray-400 mt-1">
            Academic subject categories organizing your code exercises.
          </p>
        </div>

        <Link to="/programs/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Program
          </Button>
        </Link>
      </div>

      {/* Subjects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : !stats || stats.subjectCounts.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8 text-cyanAccent-500" />}
          title="No subjects yet"
          description="Create your first program and assign it to a subject like 'DSA' or 'C Programming'."
          actionText="Create New Program"
          onAction={() => window.location.assign('/programs/new')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.subjectCounts.map((sub) => (
            <Card
              key={sub.subject}
              hoverEffect
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-cyanAccent-500/10 text-cyan-400 border border-cyanAccent-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-gray-500">
                    {sub.count} {sub.count === 1 ? 'solution' : 'solutions'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {sub.subject}
                </h3>
              </div>

              <div className="pt-4 mt-4 border-t border-dark-border flex items-center justify-between">
                <Link
                  to={`/programs?subject=${encodeURIComponent(sub.subject)}`}
                  className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
