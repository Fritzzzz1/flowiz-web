import { Link } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Button } from '@components/ui/Button';
import { AnimatedCounter } from '@components/ui/AnimatedCounter';
import { STATS } from '@/constants/home.constants';

interface HeroSectionProps {
  isVisible: boolean;
  currentPipeline: unknown | null;
  onTryDemo: () => void;
  onViewVisualization: () => void;
}

/**
 * Hero section component for the home page
 * Displays the main heading, CTAs, and statistics
 */
export function HeroSection({
  isVisible,
  currentPipeline,
  onTryDemo,
  onViewVisualization,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '1s' }}
      />

      <Container>
        <div
          className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8 animate-scale-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Future of CI/CD Visualization
            </span>
          </div>

          {/* Main heading with gradient */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-down">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              CI/CD Pipelines
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up">
            Visualize complex GitHub Actions and GitLab CI workflows as beautiful, interactive
            graphs.
            <span className="block mt-2 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Identify bottlenecks. Optimize performance. Ship faster. ✨
            </span>
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in"
            style={{ animationDelay: '0.2s' }}
          >
            {currentPipeline ? (
              <button
                onClick={onViewVisualization}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Your Pipeline
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ) : (
              <>
                <button
                  onClick={onTryDemo}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🎮 Try Interactive Demo
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <Link to="/upload">
                  <Button
                    size="large"
                    variant="secondary"
                    className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">📤 Upload Your Pipeline</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
