import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError } from '../types/api.types';

// API response wrapper types
interface ApiResponseWrapper {
  success: boolean;
  data?: {
    pipeline?: {
      id: string;
      name: string;
      platform: string;
      jobs?: Array<{
        id: string;
        name: string;
        needs?: string[];
        dependsOn?: Array<{ jobId: string; type: string }>;
        dependencies?: string[];
        steps?: Array<{
          id?: string;
          name?: string;
          uses?: string;
          with?: Record<string, string>;
          run?: string;
          command?: string;
        }>;
        [key: string]: unknown;
      }>;
      metadata?: {
        fileName?: string;
        parsedAt?: string;
        totalJobs?: number;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  metadata?: unknown;
}

class HttpService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      const data = error.response.data as Record<string, unknown>;
      return {
        message: (data.message as string) || error.message || 'An error occurred',
        statusCode: error.response.status,
        details: data.details as Record<string, unknown>,
      };
    }

    if (error.request) {
      return {
        message: 'No response from server',
        statusCode: 0,
      };
    }

    return {
      message: error.message || 'An unexpected error occurred',
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    // Check if this is a wrapped API response and unwrap it
    const responseData = response.data as ApiResponseWrapper | T;
    if (responseData && typeof responseData === 'object' && 'success' in responseData && 'data' in responseData) {
      const wrappedResponse = responseData as ApiResponseWrapper;
      // For parse endpoint, extract the pipeline from the nested structure
      if (wrappedResponse.data?.pipeline) {
        const pipeline = wrappedResponse.data.pipeline;
        // Normalize job fields to match our internal types
        if (pipeline.jobs && Array.isArray(pipeline.jobs)) {
          pipeline.jobs = pipeline.jobs.map((job) => {
            const dependencies: string[] = [];
            // Extract dependencies from 'needs' field (simple array from API)
            if (job.needs && Array.isArray(job.needs)) {
              dependencies.push(...job.needs);
            }
            // Or extract from 'dependsOn' field (complex array from API)
            else if (job.dependsOn && Array.isArray(job.dependsOn)) {
              dependencies.push(...job.dependsOn.map((dep) => dep.jobId));
            }
            // Or use existing dependencies field if present
            else if (job.dependencies && Array.isArray(job.dependencies)) {
              dependencies.push(...job.dependencies);
            }

            // Normalize steps: convert 'command' to 'run' if present
            const steps = job.steps?.map((step) => ({
              ...step,
              run: step.run || step.command,
            })) || [];

            return {
              ...job,
              dependencies,
              steps,
            };
          });
        }
        // Normalize metadata to match our internal types
        if (pipeline.metadata) {
          pipeline.metadata = {
            totalJobs: pipeline.jobs?.length || 0,
            parsedAt: pipeline.metadata.parsedAt || new Date().toISOString(),
          };
        }
        return pipeline as T;
      }
      return wrappedResponse.data as T;
    }
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const httpService = new HttpService();
