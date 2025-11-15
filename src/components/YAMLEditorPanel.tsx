import { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { validateYAML } from '../services/yaml-converter.service';
import { useTheme } from '../hooks/useTheme';

interface YAMLEditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  readOnly?: boolean;
}

export function YAMLEditorPanel({
  value,
  onChange,
  onError,
  readOnly = false,
}: YAMLEditorPanelProps) {
  const { theme } = useTheme();
  const [localError, setLocalError] = useState<string | null>(null);
  const [editorMounted, setEditorMounted] = useState(false);

  // Validate YAML whenever it changes
  useEffect(() => {
    if (!value.trim()) {
      setLocalError(null);
      onError?.(null);
      return;
    }

    const validation = validateYAML(value);
    const error = validation.valid ? null : validation.error || 'Invalid YAML';
    setLocalError(error);
    onError?.(error);
  }, [value, onError]);

  const handleEditorChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue !== undefined) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handleEditorMount = useCallback(() => {
    setEditorMounted(true);
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Workflow YAML
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {value.length} characters • {editorMounted ? 'Editor loaded' : 'Loading...'}
            </p>
          </div>
          {localError && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Syntax Error</span>
            </div>
          )}
          {!localError && value.trim() && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Valid YAML</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language="yaml"
          defaultValue={value}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
          loading={
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400">
                Loading Monaco Editor...
              </div>
            </div>
          }
        />
      </div>

      {/* Error Message */}
      {localError && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950">
          <div className="flex gap-2">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                YAML Syntax Error
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                {localError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <p>
          Edit the workflow YAML to see the diagram update in real-time. The
          diagram will automatically reflect your changes.
        </p>
      </div>
    </div>
  );
}
