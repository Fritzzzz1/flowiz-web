import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

/**
 * Skeleton component for displaying loading placeholders
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
  ...props
}: SkeletonProps) {
  const skeletonClass = clsx(
    'animate-pulse bg-gray-200 dark:bg-gray-700',
    {
      'rounded': variant === 'text',
      'rounded-full': variant === 'circular',
      'rounded-lg': variant === 'rectangular',
      'h-4': variant === 'text' && !height,
      'w-full': variant === 'text' && !width,
    },
    className
  );

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (count === 1) {
    return <div className={skeletonClass} style={style} {...props} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={clsx(skeletonClass, 'mb-2')} style={style} {...props} />
      ))}
    </>
  );
}

/**
 * Skeleton card component for loading cards
 */
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" />
          <Skeleton width="80%" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton count={3} />
      </div>
    </div>
  );
}

/**
 * Skeleton table component for loading tables
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={32} className="mb-2" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}
