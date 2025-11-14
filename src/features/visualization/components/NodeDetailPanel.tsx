import { Job } from '../../../types/api.types';
import { clsx } from 'clsx';

export interface NodeDetailPanelProps {
  node: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NodeDetailPanel({ node, isOpen, onClose }: NodeDetailPanelProps) {
  if (!isOpen || !node) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-30',
          'transform transition-transform duration-300',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{node.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Job Details</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Overview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Job ID:</span>
                <span className="text-gray-900 dark:text-white font-mono">{node.id}</span>
              </div>
              {node.runsOn && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Runs On:</span>
                  <span className="text-gray-900 dark:text-white">{node.runsOn}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dependencies */}
          {node.dependencies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Dependencies ({node.dependencies.length})
              </h4>
              <div className="space-y-2">
                {node.dependencies.map((dep) => (
                  <div
                    key={dep}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded text-sm font-mono text-gray-900 dark:text-white"
                  >
                    {dep}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {node.steps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Steps ({node.steps.length})
              </h4>
              <div className="space-y-3">
                {node.steps.map((step, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    {step.name && (
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {step.name}
                      </div>
                    )}
                    {step.uses && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Uses: <span className="font-mono">{step.uses}</span>
                      </div>
                    )}
                    {step.run && (
                      <pre className="mt-2 text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                        <code className="text-gray-900 dark:text-white">{step.run}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Environment Variables */}
          {node.environment && Object.keys(node.environment).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Environment Variables
              </h4>
              <div className="space-y-2">
                {Object.entries(node.environment).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
