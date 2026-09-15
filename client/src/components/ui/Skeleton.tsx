import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded bg-dark-panel/80 border border-dark-border/40 ${className}`}
      aria-hidden="true"
    />
  );
};
