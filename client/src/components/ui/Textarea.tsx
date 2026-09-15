import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  isMono?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, isMono = false, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="text-xs font-medium text-gray-300 select-none">
              {label}
            </label>
            {hint && <span className="text-[11px] text-gray-500">{hint}</span>}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full bg-dark-surface text-gray-100 placeholder:text-gray-500 text-sm rounded-lg border transition-all duration-150 p-3 ${
            isMono ? 'font-mono text-xs leading-relaxed' : ''
          } ${
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-dark-border hover:border-gray-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
          } focus:outline-none ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
