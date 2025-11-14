import { useState } from 'react';
import { ParseResponse, Job } from '../../../types/api.types';
import { GraphLayout } from '../services/d3-graph.service';
import { useD3Graph } from '../hooks/useD3Graph';
import { GraphControls } from './GraphControls';
import { NodeDetailPanel } from './NodeDetailPanel';
import { clsx } from 'clsx';

export interface PipelineGraphProps {
  pipeline: ParseResponse;
}

export function PipelineGraph({ pipeline }: PipelineGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Job | null>(null);
  const [layout, setLayout] = useState<GraphLayout>('force');

  const { svgRef, zoomIn, zoomOut, resetZoom, isReady } = useD3Graph(
    pipeline,
    layout,
    setSelectedNode
  );

  return (
    <div className="relative w-full h-full">
      {/* Graph Controls */}
      <GraphControls
        layout={layout}
        onLayoutChange={setLayout}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
      />

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className={clsx(
          'w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900',
          !isReady && 'animate-pulse'
        )}
        style={{ height: '800px' }}
      />

      {/* Node Detail Panel */}
      <NodeDetailPanel
        node={selectedNode}
        isOpen={selectedNode !== null}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
