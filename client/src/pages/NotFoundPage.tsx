import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-5 bg-dark-surface border border-dark-border rounded-xl p-8 shadow-modal">
        <div className="inline-block">
          <Logo size="md" to="/" />
        </div>

        <div className="p-3 rounded-lg bg-dark-panel border border-dark-border inline-block font-mono text-sm text-brand-400">
          ERROR 404: RESOURCE_NOT_FOUND
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
          The programming notebook page or assignment URL you requested does not exist or has been relocated.
        </p>

        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" size="md" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Workspace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
