import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'cyan' | 'purple' | 'yellow' | 'red' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  isMono?: boolean;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  isMono = true,
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    default: 'bg-dark-panel text-gray-300 border-dark-border',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    cyan: 'bg-cyanAccent-500/10 text-cyan-400 border-cyanAccent-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    outline: 'bg-transparent text-gray-400 border-dark-border',
  };

  const dotColors = {
    default: 'bg-gray-400',
    brand: 'bg-brand-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    outline: 'bg-gray-500',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-md select-none transition-colors ${
        isMono ? 'font-mono' : ''
      } ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} />}
      {children}
    </span>
  );
};

export const LanguageBadge: React.FC<{ language: string; className?: string }> = ({
  language,
  className = '',
}) => {
  const lang = language.toLowerCase();
  let variant: BadgeProps['variant'] = 'brand';

  if (lang === 'cpp' || lang === 'c') variant = 'cyan';
  else if (lang === 'python') variant = 'yellow';
  else if (lang === 'java') variant = 'red';
  else if (lang === 'sql') variant = 'purple';
  else if (lang === 'typescript' || lang === 'javascript') variant = 'brand';

  return (
    <Badge variant={variant} size="xs" isMono className={`uppercase tracking-wider ${className}`}>
      {language}
    </Badge>
  );
};
