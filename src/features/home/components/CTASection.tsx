import { Link } from 'react-router-dom';
import { Container } from '@components/layout/Container';

interface CTASectionProps {
  onTryDemo: () => void;
}

/**
 * Call-to-Action section component
 * Displays the final CTA with demo and upload buttons
 */
export function CTASection({ onTryDemo }: CTASectionProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

      <Container>
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-6 animate-float">
            <div className="text-6xl">🚀</div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Visualize Your Pipelines?
          </h2>

          <p className="text-xl text-white/90 mb-8">
            Start with our interactive demo or upload your own CI/CD configuration
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onTryDemo}
              className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                🎮 Try Demo Pipeline
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>

            <Link to="/upload">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                <span className="flex items-center gap-2">📤 Upload Your Own</span>
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
