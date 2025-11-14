import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { clsx } from 'clsx';

export interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({ onFileSelect, accept = '.yml,.yaml', maxSize = 1024 * 1024 }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      setError(null);

      // Check file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !['yml', 'yaml'].includes(extension)) {
        setError('Please upload a YAML file (.yml or .yaml)');
        return false;
      }

      // Check file size
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        return false;
      }

      return true;
    },
    [maxSize]
  );

  const readFile = useCallback(
    (file: File) => {
      if (!validateFile(file)) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onFileSelect(content, file.name);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        readFile(files[0]);
      }
    },
    [readFile]
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        readFile(files[0]);
      }
    },
    [readFile]
  );

  return (
    <div>
      <div
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500',
          error && 'border-red-300 dark:border-red-600'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <span className="font-medium text-primary-600 dark:text-primary-400">
                Click to upload
              </span>
              <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">YAML files only (.yml, .yaml)</p>
          </div>
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
