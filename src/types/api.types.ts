// Common API types
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Parse request and response
export interface ParseRequest {
  platform: 'github-actions' | 'gitlab-ci';
  yamlContent: string;
}

export interface Job {
  id: string;
  name: string;
  dependencies: string[];
  steps: Step[];
  environment?: Record<string, string>;
  runsOn?: string;
  if?: string;
  // Optional initial positions for demo/visualization purposes
  x?: number;
  y?: number;
}

export interface Step {
  name?: string;
  run?: string;
  uses?: string;
  with?: Record<string, string>;
}

export interface ParseResponse {
  id: string;
  platform: 'github-actions' | 'gitlab-ci';
  name: string;
  jobs: Job[];
  metadata: {
    totalJobs: number;
    parsedAt: string;
  };
}

// Validation
export interface ValidationError {
  line?: number;
  message: string;
  field?: string;
}

export interface ValidationResponse {
  valid: boolean;
  errors?: ValidationError[];
}

// Analysis
export interface AnalysisRequest {
  pipelineId: string;
}

export interface Bottleneck {
  jobId: string;
  jobName: string;
  impact: number;
  reason: string;
}

export interface AnalysisResponse {
  pipelineId: string;
  executionTime: {
    total: number;
    criticalPath: string[];
  };
  parallelization: {
    maxConcurrent: number;
    avgConcurrent: number;
  };
  bottlenecks: Bottleneck[];
}

// Dashboard
export interface DashboardData {
  pipelineId: string;
  stats: {
    totalJobs: number;
    avgExecutionTime: number;
    parallelJobs: number;
    criticalPathLength: number;
  };
  charts: {
    executionTimes: Array<{ jobName: string; duration: number; isCritical: boolean }>;
    successRate: { success: number; failed: number };
  };
}

// Integrations
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  hasWorkflows: boolean;
  lastUpdated: string;
}

export interface PipelineRun {
  id: string;
  number: number;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  commit: {
    sha: string;
    message: string;
    author: string;
  };
  createdAt: string;
  updatedAt: string;
  duration?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    provider: 'github' | 'gitlab';
  };
}
