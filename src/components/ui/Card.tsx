import { ReactNode, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
}

const variantClasses = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg border-none',
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
        'rounded-lg transition-all duration-200',
        variantClasses[variant],
        hoverable && 'hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{header}</div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
