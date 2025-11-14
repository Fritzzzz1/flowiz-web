import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

export function Integrations() {
  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your GitHub or GitLab account to browse repositories and pipelines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub Integration */}
          <Card>
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                GitHub Actions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your GitHub account to access repositories and workflows
              </p>
              <Button disabled>Connect GitHub (OAuth Coming Soon)</Button>
            </div>
          </Card>

          {/* GitLab Integration */}
          <Card>
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L.452 10.93c-.6.605-.6 1.584 0 2.188l10.427 10.426c.603.602 1.582.602 2.188 0l10.479-10.426c.6-.604.6-1.583 0-2.188z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                GitLab CI
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your GitLab account to access projects and pipelines
              </p>
              <Button disabled>Connect GitLab (OAuth Coming Soon)</Button>
            </div>
          </Card>
        </div>

        {/* Information */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How Integrations Work
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• OAuth authentication for secure access</li>
            <li>• Browse your repositories and projects</li>
            <li>• View pipeline run history</li>
            <li>• Real-time status updates via WebSocket</li>
            <li>• One-click visualization of any workflow</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            Note: OAuth integration requires backend API configuration. Use the Upload feature to
            visualize pipelines without authentication.
          </p>
        </div>
      </Container>
    </div>
  );
}
