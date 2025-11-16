import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active ' +
    'disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500',
  secondary:
    'bg-transparent text-primary border border-slate-200 ' +
    'hover:bg-slate-50 hover:border-primary ' +
    'active:bg-slate-100 ' +
    'dark:border-slate-700 dark:hover:bg-slate-800 dark:active:bg-slate-700 ' +
    'disabled:text-slate-400 disabled:border-slate-200 dark:disabled:text-slate-500 dark:disabled:border-slate-700',
  ghost:
    'bg-transparent hover:bg-slate-50 text-slate-700 ' +
    'dark:hover:bg-slate-800 dark:text-slate-300 ' +
    'disabled:text-slate-400 dark:disabled:text-slate-500',
  danger:
    'bg-danger text-white hover:bg-danger-hover active:bg-danger-active ' +
    'disabled:bg-danger-100 disabled:text-danger-200',
};

const sizeClasses = {
  small: 'px-3 py-2 text-sm min-h-[36px]',
  medium: 'px-4 py-3 text-base min-h-[44px]',
  large: 'px-6 py-4 text-base min-h-[52px]',
};

export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-subtle font-medium transition-all duration-normal',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'dark:focus-visible:ring-offset-dark-bg',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          data-testid="spinner"
          aria-label="Loading"
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
      )}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
