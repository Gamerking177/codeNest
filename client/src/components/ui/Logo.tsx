import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asLink?: boolean;
  to?: string;
}

export const CodeNestIcon: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} ${className} shrink-0 transition-transform duration-200 hover:scale-105`}
      aria-label="CodeNest Logo"
    >
      {/* Outer subtle nest container with terminal rounded rect */}
      <rect
        x="1"
        y="1"
        width="34"
        height="34"
        rx="9"
        className="fill-dark-surface stroke-dark-border"
        strokeWidth="1.5"
      />
      {/* Window header dots */}
      <circle cx="8" cy="8.5" r="1.5" className="fill-brand-500/80" />
      <circle cx="13" cy="8.5" r="1.5" className="fill-gray-600" />
      <circle cx="18" cy="8.5" r="1.5" className="fill-gray-600" />
      
      {/* Inner nest orbit / code brackets & green leaf accent */}
      {/* Nest orbit curve */}
      <path
        d="M9 25.5C8 21 10.5 15.5 15 14C19 12.5 25 14 27 19.5"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Terminal prompt chevron */}
      <path
        d="M12 18.5L16 22L12 25.5"
        stroke="#34d399"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Terminal prompt cursor line / organic leaf curve */}
      <path
        d="M19 25.5H24"
        stroke="#10b981"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Small leaf orbit node */}
      <circle cx="25.5" cy="18.5" r="2" fill="#34d399" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  iconOnly = false,
  size = 'md',
  className = '',
  asLink = true,
  to = '/',
}) => {
  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <CodeNestIcon size={size} />
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-gray-900 dark:text-white leading-none">
            <span className="text-base font-semibold tracking-tight">CodeNest</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 tracking-wider uppercase leading-none mt-1">
            notebook
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to={to} className="inline-flex focus-visible:ring-1 focus-visible:ring-brand-500 rounded">
        {content}
      </Link>
    );
  }

  return content;
};
