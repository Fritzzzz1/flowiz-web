import { create } from 'zustand';
import { ParseResponse } from '../types/api.types';

interface PipelineState {
  currentPipeline: ParseResponse | null;
  setPipeline: (pipeline: ParseResponse | null) => void;
  clearPipeline: () => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  currentPipeline: null,
  setPipeline: (pipeline) => set({ currentPipeline: pipeline }),
  clearPipeline: () => set({ currentPipeline: null }),
}));
