import { JobType } from '../services/d3-graph.service';

interface LegendItem {
  type: JobType;
  label: string;
  color: string;
}

const legendItems: LegendItem[] = [
  { type: 'setup', label: 'Setup / Install', color: '#8b5cf6' },
  { type: 'build', label: 'Build / Compile', color: '#3b82f6' },
  { type: 'test', label: 'Test / Verify', color: '#10b981' },
  { type: 'security', label: 'Security / Audit', color: '#f59e0b' },
  { type: 'deploy', label: 'Deploy / Release', color: '#ec4899' },
  { type: 'other', label: 'Other', color: '#6b7280' },
];

export function JobTypeLegend() {
  return (
    <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Job Types</h3>
      <div className="flex flex-col gap-2">
        {legendItems.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
