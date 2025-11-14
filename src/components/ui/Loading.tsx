import { clsx } from 'clsx';

// Spinner Component
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Spinner({ size = 'md', color = 'text-primary-600' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={clsx('animate-spin', sizeClasses[size], color)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
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
        'bg-gray-200 dark:bg-gray-700',
        animation === 'pulse' ? 'animate-pulse' : '',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
      style={{ width, height }}
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
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'determinate',
  color = 'bg-primary-600',
  className,
}: ProgressBarProps) {
  const percentage = variant === 'determinate' ? Math.min((value / max) * 100, 100) : 100;

  return (
    <div className={clsx('w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2', className)}>
      <div
        className={clsx('h-2 rounded-full transition-all duration-300', color)}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}
