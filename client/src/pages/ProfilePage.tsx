import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, School, Calendar, FolderCode, BookOpen, Star, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { DashboardStats } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient.get('/programs/stats');
        if (res.data?.success) {
          setStats(res.data.data.stats);
        }
      } catch {
        // Fallback
      }
    }
    loadStats();
  }, []);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'Recent Student';

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Student Profile</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          Sign Out
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 border-2 border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xl shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-8 h-8" />}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <h2 className="text-lg font-bold text-white">{user?.name}</h2>
              <Badge variant="brand" size="xs">
                {user?.role || 'USER'}
              </Badge>
            </div>

            <p className="text-xs text-gray-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>{user?.email}</span>
            </p>

            {user?.college && (
              <p className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <School className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.college}</span>
              </p>
            )}

            <p className="text-[11px] text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 pt-1 font-mono">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span>Member since {memberSince}</span>
            </p>
          </div>
        </div>

        {/* Notebook Stats Summary */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-dark-border text-center">
          <div className="p-3 rounded-lg bg-dark-panel">
            <span className="text-xl font-bold font-mono text-white block">
              {stats?.totalPrograms || 0}
            </span>
            <span className="text-[11px] text-gray-400">Programs</span>
          </div>

          <div className="p-3 rounded-lg bg-dark-panel">
            <span className="text-xl font-bold font-mono text-white block">
              {stats?.totalSubjects || 0}
            </span>
            <span className="text-[11px] text-gray-400">Subjects</span>
          </div>

          <div className="p-3 rounded-lg bg-dark-panel">
            <span className="text-xl font-bold font-mono text-white block">
              {stats?.totalFavorites || 0}
            </span>
            <span className="text-[11px] text-gray-400">Favorites</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
