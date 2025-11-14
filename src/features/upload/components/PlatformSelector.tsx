import { clsx } from 'clsx';

export interface PlatformSelectorProps {
  value: 'github' | 'gitlab';
  onChange: (platform: 'github' | 'gitlab') => void;
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Select Platform
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('github')}
          className={clsx(
            'flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all',
            value === 'github'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
          )}
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">GitHub Actions</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">.github/workflows/</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('gitlab')}
          className={clsx(
            'flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all',
            value === 'gitlab'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
          )}
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.452 10.93c-.6.605-.6 1.584 0 2.188l10.427 10.426c.603.602 1.582.602 2.188 0l10.479-10.426c.6-.604.6-1.583 0-2.188z" />
          </svg>
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">GitLab CI</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">.gitlab-ci.yml</div>
          </div>
        </button>
      </div>
    </div>
  );
}
