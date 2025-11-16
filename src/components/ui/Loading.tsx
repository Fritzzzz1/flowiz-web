import { clsx } from 'clsx';

// Spinner Component
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function Spinner({ size = 'md', color = 'text-primary', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={clsx('animate-spin', sizeClasses[size], color, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
      <span className="sr-only">Loading...</span>
    </svg>
  );
}

// Skeleton Component
export interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
  className?: string;
}

export function Skeleton({
  width,
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
  className,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-slate-200 dark:bg-slate-700',
        animation === 'pulse' ? 'animate-pulse' : '',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded-subtle',
        variant === 'rectangular' && 'rounded-subtle',
        className
      )}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
    />
  );
}

// Progress Bar Component
export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: string;
  className?: string;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'determinate',
  color = 'bg-gradient-to-r from-primary to-info',
  className,
  label,
  showPercentage = false,
}: ProgressBarProps) {
  const percentage = variant === 'determinate' ? Math.min((value / max) * 100, 100) : 100;

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-subtle h-2 overflow-hidden">
        <div
          className={clsx('h-2 rounded-subtle transition-all duration-slow', color)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || 'Progress'}
        />
      </div>
    </div>
  );
}
