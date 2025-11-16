import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Button } from '@components/ui/Button';
import { InteractiveCard } from '@components/ui/InteractiveCard';
import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { PipelineAnimation } from '@components/ui/PipelineAnimation';
import { AnimatedCounter } from '@components/ui/AnimatedCounter';
import { usePipelineStore } from '@store/pipeline.store';

const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Visualize complex pipelines in milliseconds with optimized D3.js rendering',
    color: '234, 179, 8', // yellow
  },
  {
    icon: '🎨',
    title: 'Beautiful Graphs',
    description: 'Force-directed layouts with smooth animations and interactive controls',
    color: '139, 92, 246', // purple
  },
  {
    icon: '🔍',
    title: 'Deep Analysis',
    description: 'Detect bottlenecks, critical paths, and optimization opportunities instantly',
    color: '59, 130, 246', // blue
  },
  {
    icon: '🎯',
    title: 'Intuitive UI',
    description: 'Drag, zoom, and explore your pipelines with seamless interactions',
    color: '16, 185, 129', // green
  },
  {
    icon: '🌓',
    title: 'Dark Mode',
    description: 'Gorgeous dark theme that is easy on your eyes during late-night debugging',
    color: '244, 63, 94', // pink
  },
  {
    icon: '♿',
    title: 'Accessible',
    description: 'WCAG 2.1 AA compliant with full keyboard navigation and screen reader support',
    color: '249, 115, 22', // orange
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Pipelines Visualized' },
  { value: 50000, suffix: '+', label: 'Jobs Analyzed' },
  { value: 99, suffix: '%', label: 'Uptime' },
  { value: 150, suffix: 'ms', label: 'Avg Response' },
];

export function Home() {
  const navigate = useNavigate();
  const currentPipeline = usePipelineStore((state) => state.currentPipeline);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTryDemo = () => {
    navigate('/visualize?demo=true');
  };

  const handleViewVisualization = () => {
    navigate('/visualize');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
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
                  onClick={handleViewVisualization}
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
                    onClick={handleTryDemo}
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
              {stats.map((stat, index) => (
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

      {/* Live Demo Section */}
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
              onClick={handleTryDemo}
              className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Try the full interactive demo →
            </button>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="relative py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand and optimize your CI/CD workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <InteractiveCard glowColor={feature.color}>
                  <div className="text-5xl mb-4 animate-bounce-slow">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </InteractiveCard>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Upload Section */}
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
                onClick={handleTryDemo}
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

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full p-1">
          <div className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}
