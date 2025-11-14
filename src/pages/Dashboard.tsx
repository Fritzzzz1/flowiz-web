import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';

export function Dashboard() {
  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Pipeline metrics, bottlenecks, and execution time analysis
          </p>
        </div>

        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Dashboard will be implemented in Phase 6
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
