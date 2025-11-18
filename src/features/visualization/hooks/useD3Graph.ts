import { useRef, useEffect, useState, useCallback } from 'react';
import { D3GraphService, GraphLayout } from '../services/d3-graph.service';
import { ParseResponse, Job } from '../../../types/api.types';

export function useD3Graph(
  pipeline: ParseResponse | null,
  layout: GraphLayout = 'force',
  onNodeClick?: (node: Job) => void
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const graphServiceRef = useRef<D3GraphService | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Store the latest callback in a ref to avoid re-renders when callback changes
  const onNodeClickRef = useRef(onNodeClick);

  // Update ref when callback changes (without triggering re-render)
  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

  // Initialize D3 service
  useEffect(() => {
    if (!svgRef.current) return;

    const graphService = new D3GraphService(svgRef.current, 1200, 800);
    graphServiceRef.current = graphService;
    setIsReady(true);

    return () => {
      graphService.destroy();
      graphServiceRef.current = null;
      setIsReady(false);
    };
  }, []);

  // Render graph when pipeline or layout changes
  useEffect(() => {
    if (!isReady || !pipeline || !graphServiceRef.current) return;

    const graphService = graphServiceRef.current;

    // Use a stable callback that references the latest callback from ref
    const stableNodeClickHandler = (node: Job) => {
      onNodeClickRef.current?.(node);
    };

    if (layout === 'force') {
      graphService.renderForceDirectedLayout(pipeline, stableNodeClickHandler);
    } else if (layout === 'hierarchical') {
      graphService.renderHierarchicalLayout(pipeline, stableNodeClickHandler);
    }
    // Add other layouts here in the future
  }, [pipeline, layout, isReady]); // Removed onNodeClick from dependencies

  const zoomIn = useCallback(() => {
    graphServiceRef.current?.zoomIn();
  }, []);

  const zoomOut = useCallback(() => {
    graphServiceRef.current?.zoomOut();
  }, []);

  const resetZoom = useCallback(() => {
    graphServiceRef.current?.resetZoom();
  }, []);

  return {
    svgRef,
    zoomIn,
    zoomOut,
    resetZoom,
    isReady,
  };
}
