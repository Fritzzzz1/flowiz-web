import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { PipelineGraph } from '@features/visualization/components/PipelineGraph';
import { usePipelineStore } from '@store/pipeline.store';
import { YAMLEditorPanel } from '@components/YAMLEditorPanel';
import { DEMO_WORKFLOW_YAML } from '@/mocks/demo-workflow.yaml';
import {
  convertYAMLToPipeline,
  convertPipelineToYAML,
} from '@services/yaml-converter.service';

export function Visualize() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === 'true';
  const currentPipeline = usePipelineStore((state) => state.currentPipeline);
  const setPipeline = usePipelineStore((state) => state.setPipeline);
  const [isDemo, setIsDemo] = useState(false);
  const [yamlContent, setYamlContent] = useState(DEMO_WORKFLOW_YAML);
  const [yamlError, setYamlError] = useState<string | null>(null);
  const [showYamlEditor, setShowYamlEditor] = useState(true);
  const [isDiagramUpdate, setIsDiagramUpdate] = useState(false);

  // Auto-load demo pipeline if in demo mode and no pipeline exists
  useEffect(() => {
    if (isDemoMode && !currentPipeline) {
      // Convert the demo YAML to pipeline format
      const result = convertYAMLToPipeline(DEMO_WORKFLOW_YAML);
      if (result.success && result.data) {
        setPipeline(result.data);
        setIsDemo(true);
      }
    }
  }, [isDemoMode, currentPipeline, setPipeline]);

  // Handle YAML changes from the editor
  const handleYAMLChange = useCallback(
    (newYaml: string) => {
      setYamlContent(newYaml);

      // Only update the diagram if YAML is valid
      if (!yamlError && newYaml.trim()) {
        const result = convertYAMLToPipeline(newYaml);
        if (result.success && result.data) {
          setIsDiagramUpdate(true);
          setPipeline(result.data);
          setTimeout(() => setIsDiagramUpdate(false), 100);
        }
      }
    },
    [yamlError, setPipeline]
  );

  // Handle pipeline changes from diagram editing (for future implementation)
  useEffect(() => {
    if (currentPipeline && !isDiagramUpdate && isDemoMode) {
      // Update YAML when diagram changes
      // This will be used when we implement diagram editing
      const newYaml = convertPipelineToYAML(currentPipeline);
      setYamlContent(newYaml);
    }
  }, [currentPipeline, isDiagramUpdate, isDemoMode]);

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
      <Container maxWidth="full">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Interactive Demo Mode - Edit YAML & See Live Updates
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Try editing the workflow YAML on the left and watch the diagram update in
                    real-time! {currentPipeline.metadata.totalJobs} jobs visualized.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {isDemoMode && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowYamlEditor(!showYamlEditor)}
                  >
                    {showYamlEditor ? 'Hide' : 'Show'} YAML
                  </Button>
                )}
                <Link to="/upload">
                  <Button size="sm">Upload Yours</Button>
                </Link>
              </div>
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
                {isDemo && ' • Interactive Demo'}
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

        {/* Split View - YAML Editor + Diagram */}
        {isDemoMode && showYamlEditor ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* YAML Editor */}
            <Card className="h-[800px]">
              <YAMLEditorPanel
                value={yamlContent}
                onChange={handleYAMLChange}
                onError={setYamlError}
              />
            </Card>

            {/* Graph Visualization */}
            <Card className="h-[800px]">
              <div className="flex h-full flex-col">
                <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Workflow Diagram
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visual representation of the workflow
                  </p>
                </div>
                <div className="flex-1">
                  <PipelineGraph pipeline={currentPipeline} />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Full Width Graph for non-demo mode */
          <Card>
            <PipelineGraph pipeline={currentPipeline} />
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            {isDemoMode
              ? 'Interactive Demo Features:'
              : 'How to interact with the diagram:'}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            {isDemoMode && (
              <>
                <li>
                  • <strong>Edit YAML:</strong> Modify the workflow on the left to see live
                  updates on the right
                </li>
                <li>
                  • <strong>Syntax Validation:</strong> Invalid YAML will be highlighted with
                  error messages
                </li>
                <li>
                  • <strong>Add/Remove Jobs:</strong> Try adding new jobs or changing
                  dependencies
                </li>
              </>
            )}
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
