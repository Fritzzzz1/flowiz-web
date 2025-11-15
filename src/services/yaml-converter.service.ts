import yaml from 'js-yaml';
import type { ParseResponse, Job } from '../types/api.types';

export interface YAMLParseResult {
  success: boolean;
  data?: ParseResponse;
  error?: string;
}

export interface GitHubWorkflow {
  name: string;
  on?: string | string[] | Record<string, unknown>;
  jobs: Record<
    string,
    {
      name?: string;
      'runs-on': string;
      needs?: string | string[];
      steps: Array<{
        name?: string;
        uses?: string;
        run?: string;
        with?: Record<string, unknown>;
        env?: Record<string, string>;
      }>;
      environment?: string | Record<string, unknown>;
    }
  >;
}

/**
 * Converts a GitHub Actions YAML workflow to our internal ParseResponse format
 */
export function convertYAMLToPipeline(yamlContent: string): YAMLParseResult {
  try {
    const workflow = yaml.load(yamlContent) as GitHubWorkflow;

    if (!workflow || typeof workflow !== 'object') {
      return {
        success: false,
        error: 'Invalid YAML structure',
      };
    }

    if (!workflow.jobs || typeof workflow.jobs !== 'object') {
      return {
        success: false,
        error: 'Workflow must contain a "jobs" section',
      };
    }

    const jobs: Job[] = Object.entries(workflow.jobs).map(([jobId, jobConfig], index) => {
      // Parse dependencies
      const dependencies: string[] = [];
      if (jobConfig.needs) {
        if (Array.isArray(jobConfig.needs)) {
          dependencies.push(...jobConfig.needs);
        } else if (typeof jobConfig.needs === 'string') {
          dependencies.push(jobConfig.needs);
        }
      }

      // Convert steps
      const steps =
        jobConfig.steps?.map((step) => {
          // Convert 'with' values to strings
          let withConfig: Record<string, string> | undefined;
          if (step.with && typeof step.with === 'object') {
            withConfig = Object.entries(step.with).reduce(
              (acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
              },
              {} as Record<string, string>
            );
          }

          return {
            name: step.name || step.run || step.uses || 'Unnamed step',
            run: step.run,
            uses: step.uses,
            with: withConfig,
          };
        }) || [];

      // Parse environment
      let environment: Record<string, string> | undefined;
      if (jobConfig.environment) {
        if (typeof jobConfig.environment === 'string') {
          environment = { name: jobConfig.environment };
        } else if (typeof jobConfig.environment === 'object') {
          environment = jobConfig.environment as Record<string, string>;
        }
      }

      return {
        id: jobId,
        name: jobConfig.name || jobId,
        dependencies,
        steps,
        environment,
        runsOn: jobConfig['runs-on'],
        // Calculate position based on dependencies for better layout
        x: dependencies.length * 250 + 100,
        y: index * 100 + 50,
      };
    });

    const parseResponse: ParseResponse = {
      id: `demo-${Date.now()}`,
      platform: 'github',
      name: workflow.name || 'GitHub Workflow',
      jobs,
      metadata: {
        totalJobs: jobs.length,
        parsedAt: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: parseResponse,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse YAML workflow',
    };
  }
}

/**
 * Converts our internal ParseResponse format back to GitHub Actions YAML
 */
export function convertPipelineToYAML(pipeline: ParseResponse): string {
  const workflow: GitHubWorkflow = {
    name: pipeline.name,
    on: 'push',
    jobs: {},
  };

  pipeline.jobs.forEach((job) => {
    workflow.jobs[job.id] = {
      name: job.name,
      'runs-on': job.runsOn || 'ubuntu-latest',
      ...(job.dependencies.length > 0 && {
        needs: job.dependencies.length === 1 ? job.dependencies[0] : job.dependencies,
      }),
      steps: job.steps.map((step) => {
        const stepConfig: {
          name?: string;
          uses?: string;
          run?: string;
          with?: Record<string, string>;
        } = {};

        if (step.name) {
          stepConfig.name = step.name;
        }

        if (step.uses) {
          stepConfig.uses = step.uses;
        }

        if (step.run) {
          stepConfig.run = step.run;
        }

        if (step.with && Object.keys(step.with).length > 0) {
          stepConfig.with = step.with;
        }

        return stepConfig;
      }),
    };

    // Add environment if present
    if (job.environment) {
      workflow.jobs[job.id].environment = job.environment;
    }
  });

  return yaml.dump(workflow, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
  });
}

/**
 * Validates YAML syntax without converting
 */
export function validateYAML(yamlContent: string): {
  valid: boolean;
  error?: string;
} {
  try {
    yaml.load(yamlContent);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid YAML syntax',
    };
  }
}
