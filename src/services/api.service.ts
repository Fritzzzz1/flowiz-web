import { httpService } from './http.service';
import {
  ParseRequest,
  ParseResponse,
  ValidationResponse,
  AnalysisResponse,
  DashboardData,
  Repository,
  PipelineRun,
  AuthResponse,
} from '../types/api.types';

export const apiService = {
  // Parse endpoints
  parse: (data: ParseRequest) => httpService.post<ParseResponse>('/parse', data),

  validate: (data: ParseRequest) => httpService.post<ValidationResponse>('/validate', data),

  // Analysis endpoints
  analyze: (pipelineId: string) => httpService.get<AnalysisResponse>(`/analysis/${pipelineId}`),

  // Dashboard endpoints
  getDashboardData: (pipelineId: string) =>
    httpService.get<DashboardData>(`/dashboard/${pipelineId}`),

  // GitHub endpoints
  githubAuth: () => httpService.get<{ url: string }>('/integrations/github/auth'),

  githubCallback: (code: string) =>
    httpService.post<AuthResponse>('/integrations/github/callback', { code }),

  getGitHubRepositories: () => httpService.get<Repository[]>('/integrations/github/repositories'),

  getGitHubPipelineRuns: (repoId: string) =>
    httpService.get<PipelineRun[]>(`/integrations/github/repositories/${repoId}/runs`),

  // GitLab endpoints
  gitlabAuth: () => httpService.get<{ url: string }>('/integrations/gitlab/auth'),

  gitlabCallback: (code: string) =>
    httpService.post<AuthResponse>('/integrations/gitlab/callback', { code }),

  getGitLabRepositories: () => httpService.get<Repository[]>('/integrations/gitlab/repositories'),

  getGitLabPipelineRuns: (repoId: string) =>
    httpService.get<PipelineRun[]>(`/integrations/gitlab/repositories/${repoId}/runs`),
};
