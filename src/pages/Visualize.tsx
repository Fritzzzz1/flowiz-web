import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PipelineGraph } from '@features/visualization/components/PipelineGraph';
import { usePipelineStore } from '@store/pipeline.store';
import { mockComplexPipeline } from '@/mocks/pipelines';

export function Visualize() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === 'true';
  const currentPipeline = usePipelineStore((state) => state.currentPipeline);
  const setPipeline = usePipelineStore((state) => state.setPipeline);
  const [isDemo, setIsDemo] = useState(false);

  // Auto-load demo pipeline if in demo mode and no pipeline exists
  useEffect(() => {
    if (isDemoMode && !currentPipeline) {
      setPipeline(mockComplexPipeline);
      setIsDemo(true);
    }
  }, [isDemoMode, currentPipeline, setPipeline]);

  // If not in demo mode and no pipeline, show message instead of redirect
  if (!currentPipeline && !isDemoMode) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Container maxWidth="md">
          <div className="text-center">
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Pipeline Loaded
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Upload your CI/CD configuration or try the interactive demo first
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button size="lg">📤 Upload Your Configuration</Button>
              </Link>
              <Link to="/visualize?demo=true">
                <Button size="lg" variant="secondary">
                  🎮 Try Interactive Demo
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Show loading state while demo is being set up
  if (isDemoMode && !currentPipeline) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading demo pipeline...</p>
        </div>
      </div>
    );
  }

  if (!currentPipeline) return null;

  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Demo Mode - E-Commerce Microservices Pipeline
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exploring a sample pipeline with 12 jobs: 🔧 Setup → 🔐 Auth/⚡ API/🎨 Frontend
                    → 🧪 Tests → 🔗 Integration → 🛡️ Security → 🚀 Staging → 🎭 E2E → 🌟 Production
                  </p>
                </div>
              </div>
              <Link to="/upload">
                <Button size="sm">Upload Yours</Button>
              </Link>
            </div>
          </div>
        )}

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
                {isDemo && ' • Demo Data'}
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
