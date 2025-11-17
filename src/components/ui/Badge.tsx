import { ReactNode, HTMLAttributes, memo } from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary';
  size?: 'small' | 'medium';
  children: ReactNode;
}

const variantClasses = {
  success: 'bg-success-light text-success-dark dark:bg-success-900 dark:text-success-100',
  error: 'bg-danger-light text-danger-dark dark:bg-danger-900 dark:text-danger-100',
  warning: 'bg-warning-light text-warning-dark dark:bg-warning-900 dark:text-warning-100',
  info: 'bg-info-light text-info-dark dark:bg-info-900 dark:text-info-100',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100',
};

const sizeClasses = {
  small: 'px-2 py-0.5 text-xs',
  medium: 'px-2.5 py-1 text-sm',
};

/**
 * Badge component for displaying status, labels, and tags
 * Follows the FloWiz design system specifications
 * Memoized for performance
 */
export const Badge = memo(function Badge({
  variant = 'neutral',
  size = 'medium',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-subtle whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

/**
 * Status Badge - Specialized badge for pipeline status display
 */
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'success' | 'failed' | 'running' | 'pending' | 'skipped' | 'cancelled';
}

const statusVariantMap = {
  success: 'success',
  failed: 'error',
  running: 'warning',
  pending: 'info',
  skipped: 'neutral',
  cancelled: 'neutral',
} as const;

const statusLabels = {
  success: 'Passed',
  failed: 'Failed',
  running: 'Running',
  pending: 'Pending',
  skipped: 'Skipped',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  const variant = statusVariantMap[status];
  const label = children || statusLabels[status];

  return (
    <Badge variant={variant} {...props}>
      {label}
    </Badge>
  );
}
