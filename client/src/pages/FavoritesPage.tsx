import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { apiClient } from '../api/client';
import { Program } from '../types';
import { ProgramCard } from '../components/programs/ProgramCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { ShareDialog } from '../components/sharing/ShareDialog';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sharingProgram, setSharingProgram] = useState<Program | null>(null);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/programs?isFavorite=true&limit=50');
      if (response.data?.success) {
        setFavorites(response.data.data.programs || []);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    try {
      await apiClient.patch(`/programs/${id}/favorite`);
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Star className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Starred Favorites</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Key programs and algorithms you've flagged for exam revision.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8 text-amber-400" />}
          title="No starred programs yet"
          description="Click the star icon on any program card or in the editor to keep it handy in your favorites list."
          actionText="Browse Programs"
          onAction={() => window.location.assign('/programs')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((prog) => (
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

      <ShareDialog
        isOpen={Boolean(sharingProgram)}
        onClose={() => setSharingProgram(null)}
        program={sharingProgram}
      />
    </div>
  );
};
