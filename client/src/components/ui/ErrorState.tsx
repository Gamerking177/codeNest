import React from 'react';
import { Button } from './Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  requestId?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load content',
  message = 'Something went wrong while connecting to the server. Please try again.',
  requestId,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-red-500/20 rounded-lg bg-red-500/5 ${className}`}
    >
      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-3 text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-sm leading-relaxed">
        {message}
      </p>

      {requestId && (
        <div className="mt-2 font-mono text-[11px] text-gray-500 bg-dark-panel px-2.5 py-1 rounded border border-dark-border select-all">
          Reference ID: {requestId}
        </div>
      )}

      {onRetry && (
        <div className="mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
};
