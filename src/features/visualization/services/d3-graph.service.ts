import * as d3 from 'd3';
import { ParseResponse, Job } from '../../../types/api.types';

export type GraphLayout = 'force' | 'hierarchical' | 'timeline';

export type JobType = 'setup' | 'build' | 'test' | 'security' | 'deploy' | 'other';

interface NodeDatum extends d3.SimulationNodeDatum, Job {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  layer?: number;
  indexInLayer?: number;
  jobType?: JobType;
}

interface EdgeDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: NodeDatum | string;
  target: NodeDatum | string;
}

export class D3GraphService {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g: d3.Selection<SVGGElement, unknown, null, undefined>;
  private zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private simulation: d3.Simulation<NodeDatum, EdgeDatum> | null = null;
  private width: number;
  private height: number;

  constructor(svgElement: SVGSVGElement, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.svg = d3.select(svgElement);
    this.g = this.svg.append('g').attr('class', 'graph-container');
    this.zoom = this.setupZoom();
    this.setupArrowMarkers();
  }

  private setupZoom(): d3.ZoomBehavior<SVGSVGElement, unknown> {
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform.toString());
      });

    this.svg.call(zoom);
    return zoom;
  }

  private setupArrowMarkers() {
    const defs = this.svg.append('defs');

    // Default arrow
    defs
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8');

    // Highlighted arrow
    defs
      .append('marker')
      .attr('id', 'arrowhead-highlight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#3b82f6');
  }

  private detectJobType(job: Job): JobType {
    const name = job.name.toLowerCase();
    const id = job.id.toLowerCase();
    const combined = `${name} ${id}`;

    // Setup/initialization jobs
    if (
      /setup|install|init|prepare|checkout|cache|environment|configure/.test(combined)
    ) {
      return 'setup';
    }

    // Build jobs
    if (/build|compile|bundle|package|image|docker/.test(combined)) {
      return 'build';
    }

    // Test jobs
    if (/test|spec|e2e|integration|unit|coverage|playwright/.test(combined)) {
      return 'test';
    }

    // Security jobs
    if (/security|scan|audit|trivy|sast|vulnerability|license/.test(combined)) {
      return 'security';
    }

    // Deploy jobs
    if (/deploy|release|publish|staging|production|prod|ship/.test(combined)) {
      return 'deploy';
    }

    return 'other';
  }

  private getJobTypeColor(jobType: JobType): { fill: string; stroke: string; gradient: [string, string] } {
    switch (jobType) {
      case 'setup':
        return {
          fill: '#8b5cf6',
          stroke: '#6d28d9',
          gradient: ['#8b5cf6', '#7c3aed'],
        };
      case 'build':
        return {
          fill: '#3b82f6',
          stroke: '#1e40af',
          gradient: ['#3b82f6', '#2563eb'],
        };
      case 'test':
        return {
          fill: '#10b981',
          stroke: '#047857',
          gradient: ['#10b981', '#059669'],
        };
      case 'security':
        return {
          fill: '#f59e0b',
          stroke: '#d97706',
          gradient: ['#f59e0b', '#f97316'],
        };
      case 'deploy':
        return {
          fill: '#ec4899',
          stroke: '#be185d',
          gradient: ['#ec4899', '#db2777'],
        };
      default:
        return {
          fill: '#6b7280',
          stroke: '#4b5563',
          gradient: ['#6b7280', '#4b5563'],
        };
    }
  }

  private transformData(pipeline: ParseResponse): { nodes: NodeDatum[]; edges: EdgeDatum[] } {
    const nodes: NodeDatum[] = pipeline.jobs.map((job) => {
      const node: NodeDatum = {
        ...job,
        jobType: this.detectJobType(job)
      };
      // Use predefined positions if available (for demo mode with nice initial layout)
      if (job.x !== undefined && job.y !== undefined) {
        node.x = job.x;
        node.y = job.y;
      }
      return node;
    });

    const edges: EdgeDatum[] = [];
    pipeline.jobs.forEach((job) => {
      job.dependencies.forEach((depId) => {
        edges.push({
          source: depId,
          target: job.id,
        });
      });
    });

    return { nodes, edges };
  }

  renderForceDirectedLayout(
    pipeline: ParseResponse,
    onNodeClick?: (node: NodeDatum) => void,
    onNodeHover?: (node: NodeDatum | null) => void
  ) {
    const { nodes, edges } = this.transformData(pipeline);

    // Setup gradients for each job type
    const defs = this.svg.select('defs');
    const jobTypes: JobType[] = ['setup', 'build', 'test', 'security', 'deploy', 'other'];

    jobTypes.forEach((type) => {
      if (defs.select(`#gradient-force-${type}`).empty()) {
        const colors = this.getJobTypeColor(type);
        const gradient = defs
          .append('linearGradient')
          .attr('id', `gradient-force-${type}`)
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '100%')
          .attr('y2', '100%');

        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', colors.gradient[0])
          .attr('stop-opacity', 1);

        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', colors.gradient[1])
          .attr('stop-opacity', 1);
      }
    });

    // Node dimensions (same as hierarchical layout)
    const nodeWidth = 200;
    const nodeHeight = 100;

    // Check if nodes have predefined positions (demo mode)
    const hasInitialPositions = nodes.some((n) => n.x !== undefined && n.y !== undefined);

    // Create force simulation with grid constraints
    this.simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<NodeDatum, EdgeDatum>(edges)
          .id((d) => d.id)
          .distance(250)
          .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(120))
      .alphaDecay(hasInitialPositions ? 0.05 : 0.0228);

    // Render edges with orthogonal paths
    const link = this.g
      .append('g')
      .attr('class', 'edges')
      .selectAll('path')
      .data(edges)
      .join('path')
      .attr('class', 'edge')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.7)
      .attr('marker-end', 'url(#arrowhead)');

    // Render nodes
    const node = this.g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('cursor', 'grab')
      .call(this.drag(this.simulation) as never)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) onNodeClick(d);
      })
      .on('mouseenter', (_event, d) => {
        if (onNodeHover) onNodeHover(d);
        // Highlight connected edges
        link
          .attr('stroke', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? '#3b82f6' : '#94a3b8';
          })
          .attr('stroke-width', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? 4 : 2.5;
          })
          .attr('opacity', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? 1 : 0.3;
          });
      })
      .on('mouseleave', () => {
        if (onNodeHover) onNodeHover(null);
        link.attr('stroke', '#94a3b8').attr('stroke-width', 2.5).attr('opacity', 0.7);
      });

    // Add rounded rectangles with gradients (same as hierarchical layout)
    node
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', (d) => `url(#gradient-force-${d.jobType})`)
      .attr('stroke', (d) => this.getJobTypeColor(d.jobType || 'other').stroke)
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))');

    // Add job type badge
    node
      .append('rect')
      .attr('width', 70)
      .attr('height', 22)
      .attr('x', -nodeWidth / 2 + 8)
      .attr('y', -nodeHeight / 2 + 8)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'rgba(0, 0, 0, 0.2)')
      .attr('pointer-events', 'none');

    node
      .append('text')
      .text((d) => (d.jobType || 'other').toUpperCase())
      .attr('x', -nodeWidth / 2 + 43)
      .attr('y', -nodeHeight / 2 + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none');

    // Add job names
    node
      .append('text')
      .text((d) => this.truncateLabel(d.name, 25))
      .attr('x', 0)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '15px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.3)');

    // Add step count
    node
      .append('text')
      .text((d) => `${d.steps.length} step${d.steps.length !== 1 ? 's' : ''}`)
      .attr('x', 0)
      .attr('y', nodeHeight / 2 - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.8)')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none');

    // Add dependency count if any
    node
      .filter((d) => d.dependencies.length > 0)
      .append('text')
      .text((d) => `↓ ${d.dependencies.length}`)
      .attr('x', nodeWidth / 2 - 8)
      .attr('y', -nodeHeight / 2 + 21)
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none');

    // Update positions on tick with orthogonal edge routing
    this.simulation.on('tick', () => {
      // Draw orthogonal paths for edges
      link.attr('d', (d) => {
        const source = d.source as NodeDatum;
        const target = d.target as NodeDatum;
        const sx = source.x || 0;
        const sy = source.y || 0;
        const tx = target.x || 0;
        const ty = target.y || 0;

        // Determine if we should route horizontally or vertically first
        const dx = Math.abs(tx - sx);
        const dy = Math.abs(ty - sy);

        if (dx > dy) {
          // Route horizontally first
          const midX = (sx + tx) / 2;
          return `M ${sx},${sy}
                  L ${midX},${sy}
                  L ${midX},${ty}
                  L ${tx},${ty}`;
        } else {
          // Route vertically first
          const midY = (sy + ty) / 2;
          return `M ${sx},${sy}
                  L ${sx},${midY}
                  L ${tx},${midY}
                  L ${tx},${ty}`;
        }
      });

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });
  }

  private drag(simulation: d3.Simulation<NodeDatum, EdgeDatum>) {
    function dragstarted(event: d3.D3DragEvent<SVGGElement, NodeDatum, NodeDatum>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, NodeDatum, NodeDatum>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, NodeDatum, NodeDatum>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag<SVGGElement, NodeDatum>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  private calculateLayers(nodes: NodeDatum[], edges: EdgeDatum[]): Map<string, number> {
    // Calculate layers using topological sort (Kahn's algorithm)
    const layers = new Map<string, number>();
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    // Initialize
    nodes.forEach((node) => {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    });

    // Build adjacency list and calculate in-degrees
    edges.forEach((edge) => {
      const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;

      adjList.get(sourceId)?.push(targetId);
      inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
    });

    // Start with nodes that have no dependencies (layer 0)
    const queue: Array<{ id: string; layer: number }> = [];
    nodes.forEach((node) => {
      if (inDegree.get(node.id) === 0) {
        queue.push({ id: node.id, layer: 0 });
        layers.set(node.id, 0);
      }
    });

    // Process queue
    while (queue.length > 0) {
      const current = queue.shift()!;

      adjList.get(current.id)?.forEach((neighborId) => {
        const newInDegree = (inDegree.get(neighborId) || 0) - 1;
        inDegree.set(neighborId, newInDegree);

        const currentLayer = layers.get(neighborId) || 0;
        const newLayer = Math.max(currentLayer, current.layer + 1);
        layers.set(neighborId, newLayer);

        if (newInDegree === 0) {
          queue.push({ id: neighborId, layer: newLayer });
        }
      });
    }

    return layers;
  }

  renderHierarchicalLayout(
    pipeline: ParseResponse,
    onNodeClick?: (node: NodeDatum) => void,
    onNodeHover?: (node: NodeDatum | null) => void
  ) {
    const { nodes, edges } = this.transformData(pipeline);

    // Calculate layers for each node
    const layerMap = this.calculateLayers(nodes, edges);

    // Group nodes by layer
    const nodesByLayer = new Map<number, NodeDatum[]>();
    nodes.forEach((node) => {
      const layer = layerMap.get(node.id) || 0;
      node.layer = layer;
      if (!nodesByLayer.has(layer)) {
        nodesByLayer.set(layer, []);
      }
      nodesByLayer.get(layer)!.push(node);
    });

    // Enhanced grid configuration for left-to-right layout
    const nodeWidth = 200;
    const nodeHeight = 100;
    const horizontalSpacing = 300; // Space between layers
    const verticalSpacing = 140; // Space between nodes in same layer
    const topPadding = 60;
    const leftPadding = 80;

    // Position nodes in a left-to-right flow
    nodesByLayer.forEach((layerNodes, layer) => {
      const layerHeight = layerNodes.length * verticalSpacing;
      const startY = (this.height - layerHeight) / 2;

      layerNodes.forEach((node, index) => {
        node.x = leftPadding + layer * horizontalSpacing;
        node.y = startY + index * verticalSpacing + topPadding;
        node.indexInLayer = index;
      });
    });

    // Render edges with orthogonal (90-degree) paths
    const link = this.g
      .append('g')
      .attr('class', 'edges')
      .selectAll('path')
      .data(edges)
      .join('path')
      .attr('class', 'edge')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.7)
      .attr('marker-end', 'url(#arrowhead)');

    // Setup gradients for each job type
    const defs = this.svg.select('defs');
    const jobTypes: JobType[] = ['setup', 'build', 'test', 'security', 'deploy', 'other'];

    jobTypes.forEach((type) => {
      const colors = this.getJobTypeColor(type);
      const gradient = defs
        .append('linearGradient')
        .attr('id', `gradient-${type}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors.gradient[0])
        .attr('stop-opacity', 1);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors.gradient[1])
        .attr('stop-opacity', 1);
    });

    // Render node groups
    const node = this.g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) onNodeClick(d);
      })
      .on('mouseenter', (_event, d) => {
        if (onNodeHover) onNodeHover(d);
        // Highlight connected edges and increase opacity
        link
          .attr('stroke', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? '#3b82f6' : '#cbd5e1';
          })
          .attr('stroke-width', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? 4 : 2.5;
          })
          .attr('opacity', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? 1 : 0.3;
          });
      })
      .on('mouseleave', () => {
        if (onNodeHover) onNodeHover(null);
        link.attr('stroke', '#94a3b8').attr('stroke-width', 2.5).attr('opacity', 0.7);
      });

    // Add rounded rectangles with gradients based on job type
    node
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', (d) => `url(#gradient-${d.jobType})`)
      .attr('stroke', (d) => this.getJobTypeColor(d.jobType || 'other').stroke)
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))')
      .attr('class', 'node-rect')
      .style('transition', 'all 0.3s ease');

    // Add job type badge
    node
      .append('rect')
      .attr('width', 70)
      .attr('height', 22)
      .attr('x', -nodeWidth / 2 + 8)
      .attr('y', -nodeHeight / 2 + 8)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'rgba(0, 0, 0, 0.2)')
      .attr('pointer-events', 'none');

    node
      .append('text')
      .text((d) => (d.jobType || 'other').toUpperCase())
      .attr('x', -nodeWidth / 2 + 43)
      .attr('y', -nodeHeight / 2 + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none');

    // Add job names (main label)
    node
      .append('text')
      .text((d) => this.truncateLabel(d.name, 25))
      .attr('x', 0)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '15px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.3)');

    // Add step count indicator
    node
      .append('text')
      .text((d) => `${d.steps.length} step${d.steps.length !== 1 ? 's' : ''}`)
      .attr('x', 0)
      .attr('y', nodeHeight / 2 - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.8)')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none');

    // Add dependency count if any
    node
      .filter((d) => d.dependencies.length > 0)
      .append('text')
      .text((d) => `↓ ${d.dependencies.length}`)
      .attr('x', nodeWidth / 2 - 8)
      .attr('y', -nodeHeight / 2 + 21)
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(255, 255, 255, 0.7)')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none');

    // Update edge paths to draw orthogonal (90-degree) paths
    link.attr('d', (d) => {
      const source = d.source as NodeDatum;
      const target = d.target as NodeDatum;

      const sourceX = (source.x || 0) + nodeWidth / 2;
      const sourceY = source.y || 0;
      const targetX = (target.x || 0) - nodeWidth / 2;
      const targetY = target.y || 0;

      // Calculate midpoint for orthogonal routing
      const midX = (sourceX + targetX) / 2;

      // Draw orthogonal path: horizontal -> vertical -> horizontal
      return `M ${sourceX},${sourceY}
              L ${midX},${sourceY}
              L ${midX},${targetY}
              L ${targetX},${targetY}`;
    });
  }

  private truncateLabel(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  zoomIn() {
    this.svg.transition().call(this.zoom.scaleBy, 1.3);
  }

  zoomOut() {
    this.svg.transition().call(this.zoom.scaleBy, 0.7);
  }

  resetZoom() {
    this.svg.transition().call(this.zoom.transform, d3.zoomIdentity);
  }

  destroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
    this.svg.selectAll('*').remove();
  }
}
