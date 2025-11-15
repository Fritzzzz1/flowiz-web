import * as d3 from 'd3';
import { ParseResponse, Job } from '../../../types/api.types';

export type GraphLayout = 'force' | 'hierarchical' | 'timeline';

interface NodeDatum extends d3.SimulationNodeDatum, Job {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  layer?: number;
  indexInLayer?: number;
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

  private transformData(pipeline: ParseResponse): { nodes: NodeDatum[]; edges: EdgeDatum[] } {
    const nodes: NodeDatum[] = pipeline.jobs.map((job) => {
      const node: NodeDatum = { ...job };
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

    // Check if nodes have predefined positions (demo mode)
    const hasInitialPositions = nodes.some((n) => n.x !== undefined && n.y !== undefined);

    // Create force simulation with weaker forces if using initial positions
    this.simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<NodeDatum, EdgeDatum>(edges)
          .id((d) => d.id)
          .distance(hasInitialPositions ? 200 : 150)
          .strength(hasInitialPositions ? 0.3 : 1)
      )
      .force('charge', d3.forceManyBody().strength(hasInitialPositions ? -100 : -300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .alphaDecay(hasInitialPositions ? 0.05 : 0.0228); // Faster settling with initial positions

    // Render edges
    const link = this.g
      .append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('class', 'edge')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Render nodes
    const node = this.g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
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
            return source === d.id || target === d.id ? 3 : 2;
          });
      })
      .on('mouseleave', () => {
        if (onNodeHover) onNodeHover(null);
        // Reset edges
        link.attr('stroke', '#94a3b8').attr('stroke-width', 2);
      });

    // Add circles
    node
      .append('circle')
      .attr('r', 50)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');

    // Add labels
    node
      .append('text')
      .text((d) => this.truncateLabel(d.name, 15))
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#fff')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.3)');

    // Update positions on tick
    this.simulation.on('tick', () => {
      link
        .attr('x1', (d) => {
          const source = d.source as NodeDatum;
          return source.x || 0;
        })
        .attr('y1', (d) => {
          const source = d.source as NodeDatum;
          return source.y || 0;
        })
        .attr('x2', (d) => {
          const target = d.target as NodeDatum;
          return target.x || 0;
        })
        .attr('y2', (d) => {
          const target = d.target as NodeDatum;
          return target.y || 0;
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

    // Grid configuration
    const nodeWidth = 240;
    const nodeHeight = 80;
    const horizontalSpacing = 280;
    const verticalSpacing = 150;
    const topPadding = 100;
    const leftPadding = 100;

    // Position nodes on grid
    nodesByLayer.forEach((layerNodes, layer) => {
      const layerWidth = layerNodes.length * horizontalSpacing;
      const startX = (this.width - layerWidth) / 2 + leftPadding;

      layerNodes.forEach((node, index) => {
        node.x = startX + index * horizontalSpacing + nodeWidth / 2;
        node.y = topPadding + layer * verticalSpacing + nodeHeight / 2;
        node.indexInLayer = index;
      });
    });

    // Render edges with straight lines
    const link = this.g
      .append('g')
      .attr('class', 'edges')
      .selectAll('path')
      .data(edges)
      .join('path')
      .attr('class', 'edge')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Render node groups
    const node = this.g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .attr(
        'transform',
        (d) => `translate(${(d.x || 0) - nodeWidth / 2},${(d.y || 0) - nodeHeight / 2})`
      )
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
            return source === d.id || target === d.id ? '#3b82f6' : '#cbd5e1';
          })
          .attr('stroke-width', (l) => {
            const linkData = l as unknown as EdgeDatum;
            const source =
              typeof linkData.source === 'object' ? linkData.source.id : linkData.source;
            const target =
              typeof linkData.target === 'object' ? linkData.target.id : linkData.target;
            return source === d.id || target === d.id ? 3 : 2;
          });
      })
      .on('mouseleave', () => {
        if (onNodeHover) onNodeHover(null);
        link.attr('stroke', '#cbd5e1').attr('stroke-width', 2);
      });

    // Add rectangle backgrounds with gradient
    const defs = this.svg.select('defs');

    // Define gradient for nodes
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'node-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2563eb')
      .attr('stop-opacity', 1);

    // Add rectangles
    node
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', 'url(#node-gradient)')
      .attr('stroke', '#1e40af')
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');

    // Add job names
    node
      .append('text')
      .text((d) => this.truncateLabel(d.name, 30))
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none');

    // Update edge paths to draw straight lines
    link.attr('d', (d) => {
      const source = d.source as NodeDatum;
      const target = d.target as NodeDatum;

      const sourceX = source.x || 0;
      const sourceY = (source.y || 0) + nodeHeight / 2;
      const targetX = target.x || 0;
      const targetY = (target.y || 0) - nodeHeight / 2;

      // Draw straight line or gentle curve
      const midY = (sourceY + targetY) / 2;

      return `M ${sourceX},${sourceY}
              L ${sourceX},${midY}
              L ${targetX},${midY}
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
