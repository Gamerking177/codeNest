import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 bg-dark-surface border border-red-500/20 rounded-xl p-8 shadow-modal">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h1 className="text-lg font-bold text-white">Something went wrong</h1>
        <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
          An unexpected error interrupted the application. Technical details have been isolated.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.location.reload()}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reload Workspace
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = '/dashboard')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
