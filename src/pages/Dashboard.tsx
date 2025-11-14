import { Navigate } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { StatCard } from '@features/dashboard/components/StatCard';
import { usePipelineStore } from '@store/pipeline.store';

export function Dashboard() {
  const currentPipeline = usePipelineStore((state) => state.currentPipeline);

  if (!currentPipeline) {
    return <Navigate to="/upload" replace />;
  }

  // Calculate some basic statistics
  const totalJobs = currentPipeline.metadata.totalJobs;
  const jobsWithDeps = currentPipeline.jobs.filter((j) => j.dependencies.length > 0).length;
  const avgDependencies =
    currentPipeline.jobs.reduce((sum, j) => sum + j.dependencies.length, 0) / totalJobs;
  const totalSteps = currentPipeline.jobs.reduce((sum, j) => sum + j.steps.length, 0);

  return (
    <div className="py-12">
      <Container maxWidth="2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Pipeline metrics and insights for {currentPipeline.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Jobs"
            value={totalJobs}
            icon="📊"
            color="text-blue-600"
          />
          <StatCard
            label="Jobs with Dependencies"
            value={jobsWithDeps}
            icon="🔗"
            color="text-purple-600"
          />
          <StatCard
            label="Avg Dependencies"
            value={avgDependencies.toFixed(1)}
            icon="📈"
            color="text-green-600"
          />
          <StatCard
            label="Total Steps"
            value={totalSteps}
            icon="⚙️"
            color="text-orange-600"
          />
        </div>

        {/* Jobs List */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Jobs Overview</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentPipeline.jobs.map((job) => (
              <div key={job.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {job.dependencies.length} dependencies • {job.steps.length} steps
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {job.runsOn && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {job.runsOn}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
