import { Container } from '@components/layout/Container';
import { PipelineAnimation } from '@components/ui/PipelineAnimation';

interface LiveDemoSectionProps {
  onTryDemo: () => void;
}

/**
 * Live demo section component
 * Displays the pipeline animation and demo CTA
 */
export function LiveDemoSection({ onTryDemo }: LiveDemoSectionProps) {
  return (
    <section className="relative py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            This mini animation shows pipeline flow. Click "Try Interactive Demo" above to explore
            the full D3.js visualization with drag, zoom, and click interactions!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PipelineAnimation />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ✨ Real-time updates • 🎨 Smooth animations • 🚀 Zero API calls needed
          </p>
          <button
            onClick={onTryDemo}
            className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Try the full interactive demo →
          </button>
        </div>
      </Container>
    </section>
  );
}
