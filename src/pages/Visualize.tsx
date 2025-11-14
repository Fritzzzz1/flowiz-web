import { Navigate } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PipelineGraph } from '@features/visualization/components/PipelineGraph';
import { usePipelineStore } from '@store/pipeline.store';

export function Visualize() {
  const currentPipeline = usePipelineStore((state) => state.currentPipeline);

  if (!currentPipeline) {
    return <Navigate to="/upload" replace />;
  }

  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentPipeline.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentPipeline.platform === 'github' ? 'GitHub Actions' : 'GitLab CI'} •{' '}
                {currentPipeline.metadata.totalJobs} jobs
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => window.history.back()}>
                ← Back
              </Button>
              <Button>Export SVG</Button>
            </div>
          </div>
        </div>

        {/* Graph Visualization */}
        <Card>
          <PipelineGraph pipeline={currentPipeline} />
        </Card>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            How to interact:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Click and drag nodes to reposition them</li>
            <li>• Hover over nodes to highlight connections</li>
            <li>• Click nodes to view detailed information</li>
            <li>• Use the controls to zoom and change layouts</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
