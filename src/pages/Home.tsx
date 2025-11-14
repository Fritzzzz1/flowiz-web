import { Link } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

const features = [
  {
    icon: '📊',
    title: 'Interactive Visualizations',
    description: 'Beautiful D3.js graphs with force-directed, hierarchical, and timeline layouts',
  },
  {
    icon: '🔍',
    title: 'Pipeline Analysis',
    description: 'Detect bottlenecks, critical paths, and optimization opportunities',
  },
  {
    icon: '🔄',
    title: 'Real-time Updates',
    description: 'Live pipeline status updates via WebSocket connections',
  },
  {
    icon: '🔗',
    title: 'GitHub & GitLab',
    description: 'OAuth integration with your favorite CI/CD platforms',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    description: 'Works beautifully on desktop, tablet, and mobile devices',
  },
  {
    icon: '♿',
    title: 'Accessible',
    description: 'WCAG 2.1 AA compliant with full keyboard navigation',
  },
];

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Visualize Your CI/CD Pipelines
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Transform complex GitHub Actions and GitLab CI workflows into beautiful, interactive
              graphs. Identify bottlenecks, optimize execution times, and understand dependencies at
              a glance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/integrations">
                <Button size="lg" variant="secondary">
                  Connect GitHub
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to understand and optimize your CI/CD workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hoverable>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8">
              Upload your YAML configuration or connect your GitHub/GitLab account to begin
              visualizing your pipelines.
            </p>
            <Link to="/upload">
              <Button size="lg" variant="secondary">
                Upload Configuration
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
