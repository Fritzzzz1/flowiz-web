import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';

export function Visualize() {
  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pipeline Visualization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive D3.js graph of your CI/CD pipeline
          </p>
        </div>

        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Visualization will be implemented in Phase 5
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
