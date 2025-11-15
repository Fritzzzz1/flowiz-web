import { ReactNode, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
}

const variantClasses = {
  default:
    'bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-sm',
  outlined: 'bg-transparent border-2 border-slate-300 dark:border-slate-600',
  elevated: 'bg-white dark:bg-dark-surface shadow-md border-none',
};

export function Card({
  header,
  footer,
  variant = 'default',
  hoverable = false,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-round transition-all duration-normal',
        variantClasses[variant],
        hoverable && 'hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-border">
          {header}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-bg rounded-b-round">
          {footer}
        </div>
      )}
    </div>
  );
}
