import { Button } from '@components/ui/Button';
import { GraphLayout } from '../services/d3-graph.service';

export interface GraphControlsProps {
  layout: GraphLayout;
  onLayoutChange: (layout: GraphLayout) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function GraphControls({
  layout,
  onLayoutChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: GraphControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-1">
        <Button size="small" onClick={onZoomIn} title="Zoom In">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
        <Button size="small" onClick={onZoomOut} title="Zoom Out">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </Button>
        <Button size="small" onClick={onResetZoom} title="Reset Zoom">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Button>
      </div>

      {/* Layout Selector */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
        <select
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value as GraphLayout)}
          className="w-full px-2 py-1 text-sm rounded bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600"
        >
          <option value="force">Force Layout</option>
          <option value="hierarchical" disabled>
            Hierarchical (Coming Soon)
          </option>
          <option value="timeline" disabled>
            Timeline (Coming Soon)
          </option>
        </select>
      </div>
    </div>
  );
}
