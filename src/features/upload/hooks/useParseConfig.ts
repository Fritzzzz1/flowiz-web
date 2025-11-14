import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@services/api.service';
import { usePipelineStore } from '@store/pipeline.store';
import { useToast } from '@components/ui/Toast';
import { ParseRequest } from '../../../types/api.types';

export function useParseConfig() {
  const navigate = useNavigate();
  const setPipeline = usePipelineStore((state) => state.setPipeline);
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: ParseRequest) => apiService.parse(data),
    onSuccess: (pipeline) => {
      setPipeline(pipeline);
      showToast({
        type: 'success',
        message: `Successfully parsed ${pipeline.metadata.totalJobs} jobs from ${pipeline.platform} configuration`,
      });
      navigate('/visualize');
    },
    onError: (error: Error) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to parse configuration',
      });
    },
  });
}
