import { ChangeEvent } from 'react';
import { clsx } from 'clsx';

export interface YAMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readonly?: boolean;
}

export function YAMLEditor({ value, onChange, error, readonly = false }: YAMLEditorProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const lineCount = value.split('\n').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          YAML Content
        </label>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          readOnly={readonly}
          className={clsx(
            'w-full h-96 px-4 py-3 font-mono text-sm',
            'bg-gray-50 dark:bg-gray-900 border rounded-lg',
            'text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600',
            readonly && 'cursor-not-allowed opacity-75'
          )}
          placeholder="Paste your GitHub Actions or GitLab CI YAML configuration here..."
          spellCheck={false}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
