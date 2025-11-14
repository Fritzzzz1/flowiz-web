# FloWiz Web - D3.js Visualization Design

## Overview

This document defines the D3.js visualization strategy for rendering interactive CI/CD pipeline graphs. The visualization must handle complex dependency graphs, support multiple layout algorithms, provide rich interactions, and maintain high performance.

---

## Design Goals

1. **Clarity**: Clear visual representation of job dependencies
2. **Interactivity**: Zoom, pan, drag, hover, click interactions
3. **Performance**: Handle 100+ nodes smoothly
4. **Responsiveness**: Adapt to different screen sizes
5. **Accessibility**: Keyboard navigation, ARIA labels
6. **Aesthetics**: Modern, professional appearance

---

## Graph Representation

### Node (Job) Structure

```typescript
interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  status?: 'pending' | 'running' | 'success' | 'failed';
  duration?: number; // in seconds
  platform: 'github' | 'gitlab';
  dependencies: string[]; // IDs of dependent jobs
  steps: Step[];
  environment: Record<string, string>;

  // D3 force simulation properties
  x?: number;
  y?: number;
  fx?: number | null; // fixed x position (when dragged)
  fy?: number | null; // fixed y position (when dragged)
  vx?: number;
  vy?: number;
}

interface Step {
  name: string;
  command?: string;
  uses?: string; // For GitHub Actions
}
```

### Edge (Dependency) Structure

```typescript
interface EdgeDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: NodeDatum;
  target: NodeDatum;
  type?: 'required' | 'optional'; // For conditional dependencies
}
```

---

## Layout Algorithms

### 1. Force-Directed Layout (Default)

**Use Case**: General-purpose, works well for most pipelines

**Algorithm**: D3's force simulation with multiple forces

```typescript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(edges)
    .id(d => d.id)
    .distance(150) // Distance between connected nodes
  )
  .force('charge', d3.forceManyBody()
    .strength(-300) // Repulsion between all nodes
  )
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide()
    .radius(50) // Prevent node overlap
  )
  .force('x', d3.forceX(width / 2).strength(0.05))
  .force('y', d3.forceY(height / 2).strength(0.05));
```

**Pros**:
- Natural-looking layout
- Good for cyclic dependencies
- Easy to understand

**Cons**:
- Non-deterministic (layout changes each time)
- Can be chaotic for very large graphs

**Visual Example**:
```
          [test]
             ↑
             |
          [build] ──→ [lint]
             ↑
             |
         [checkout]
```

---

### 2. Hierarchical/Tree Layout

**Use Case**: Pipelines with clear dependency hierarchy (no cycles)

**Algorithm**: D3's tree layout

```typescript
// Build hierarchy from flat structure
const stratify = d3.stratify<NodeDatum>()
  .id(d => d.id)
  .parentId(d => d.dependencies[0]); // First dependency is parent

const root = stratify(nodes);

const treeLayout = d3.tree<NodeDatum>()
  .size([width, height])
  .separation((a, b) => a.parent === b.parent ? 1 : 2);

const treeData = treeLayout(root);
```

**Pros**:
- Deterministic layout
- Clear visual hierarchy
- Good for simple pipelines

**Cons**:
- Can't handle cycles
- May not utilize space efficiently

**Visual Example**:
```
                 [checkout]
                     |
         ┌───────────┼───────────┐
         ↓           ↓           ↓
      [build]      [lint]     [test]
         |
    ┌────┴────┐
    ↓         ↓
 [deploy]  [notify]
```

---

### 3. Timeline/Gantt Layout (Custom)

**Use Case**: Show temporal execution order and parallelization

**Algorithm**: Custom layout based on critical path analysis

```typescript
function timelineLayout(nodes: NodeDatum[], edges: EdgeDatum[]) {
  // 1. Calculate critical path
  const criticalPath = calculateCriticalPath(nodes, edges);

  // 2. Assign each node a "track" (Y position) and "time" (X position)
  const tracks = assignTracks(nodes, edges);

  // 3. Position nodes
  nodes.forEach(node => {
    node.x = node.startTime * timeScale;
    node.y = tracks[node.id] * trackHeight;
  });

  return nodes;
}
```

**Pros**:
- Shows execution timeline
- Visualizes parallelization
- Highlights bottlenecks

**Cons**:
- Requires duration estimates
- More complex to implement

**Visual Example**:
```
Track 1: [checkout]────[build]─────────────[deploy]
Track 2:                    [test]───────────
Track 3:                    [lint]───────────[notify]
         └───────────────────────────────────────→ Time
```

---

### 4. Circular/Radial Layout (Bonus)

**Use Case**: Artistic representation, good for presentations

**Algorithm**: Position nodes in concentric circles based on depth

```typescript
const radialLayout = d3.cluster<NodeDatum>()
  .size([2 * Math.PI, radius]);

const root = d3.hierarchy(nodes);
const radialData = radialLayout(root);
```

**Visual Example**:
```
            [test]
              │
    [lint]────●────[deploy]
              │
          [checkout]
              │
           [build]
```

---

## Visual Design

### Node Representation

#### Default Node
```svg
<g class="node" data-id="build-job">
  <!-- Circle background -->
  <circle
    r="40"
    fill="#3b82f6"
    stroke="#fff"
    stroke-width="2"
  />

  <!-- Job name -->
  <text
    text-anchor="middle"
    dy=".35em"
    fill="#fff"
    font-size="14px"
    font-weight="500"
  >
    Build
  </text>

  <!-- Status icon (optional) -->
  <circle
    r="8"
    cx="28"
    cy="-28"
    fill="#10b981"
    class="status-indicator"
  />
</g>
```

#### Node States

**Pending** (default):
- Color: `#3b82f6` (blue)
- No status indicator

**Running**:
- Color: `#f59e0b` (orange)
- Pulsing animation
- Status indicator: Orange circle

**Success**:
- Color: `#10b981` (green)
- Status indicator: Green checkmark icon

**Failed**:
- Color: `#ef4444` (red)
- Status indicator: Red X icon

**Hover**:
- Scale: 1.1
- Shadow: `0 4px 12px rgba(0,0,0,0.15)`
- Cursor: pointer

**Selected**:
- Stroke: `#1e40af` (dark blue)
- Stroke-width: 4

**Critical Path**:
- Stroke: `#fbbf24` (yellow)
- Stroke-width: 3
- Stroke-dasharray: "5,5"

---

### Edge Representation

#### Default Edge
```svg
<line
  class="edge"
  x1="100" y1="200"
  x2="300" y2="200"
  stroke="#94a3b8"
  stroke-width="2"
  marker-end="url(#arrowhead)"
/>
```

#### Edge States

**Default**:
- Color: `#94a3b8` (gray)
- Width: 2px
- Arrowhead

**Hover** (when node hovered):
- Color: `#3b82f6` (blue)
- Width: 3px

**Critical Path**:
- Color: `#fbbf24` (yellow)
- Width: 3px
- Dashed

**Conditional Dependency**:
- Stroke-dasharray: "5,5"
- Opacity: 0.6

---

### Arrow Markers

```svg
<defs>
  <!-- Default arrowhead -->
  <marker
    id="arrowhead"
    viewBox="0 -5 10 10"
    refX="25"
    refY="0"
    markerWidth="6"
    markerHeight="6"
    orient="auto"
  >
    <path d="M0,-5L10,0L0,5" fill="#94a3b8" />
  </marker>

  <!-- Highlighted arrowhead -->
  <marker id="arrowhead-highlight" ...>
    <path d="M0,-5L10,0L0,5" fill="#3b82f6" />
  </marker>
</defs>
```

---

## Interactions

### 1. Zoom & Pan

**Implementation**:
```typescript
const zoom = d3.zoom()
  .scaleExtent([0.1, 4]) // Min 10%, max 400%
  .on('zoom', (event) => {
    g.attr('transform', event.transform);
  });

svg.call(zoom);
```

**Interactions**:
- **Mouse wheel**: Zoom in/out
- **Click + drag**: Pan
- **Pinch** (touch): Zoom
- **Buttons**: Zoom in (+), Zoom out (-), Reset (⌂)

**Constraints**:
- Prevent zoom beyond bounds
- Smooth transitions

---

### 2. Node Drag

**Implementation**:
```typescript
const drag = d3.drag()
  .on('start', (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  })
  .on('drag', (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  })
  .on('end', (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    // Option to keep fixed position or release
    d.fx = null;
    d.fy = null;
  });

nodeElements.call(drag);
```

**Behavior**:
- Drag nodes to reposition
- Other nodes adjust (in force layout)
- Nodes snap back when released (or stay fixed)

---

### 3. Hover Effects

**Implementation**:
```typescript
nodeElements
  .on('mouseenter', function(event, d) {
    // Highlight node
    d3.select(this)
      .select('circle')
      .transition()
      .duration(200)
      .attr('r', 44)
      .attr('stroke-width', 3);

    // Highlight connected edges
    edgeElements
      .filter(e => e.source.id === d.id || e.target.id === d.id)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3);

    // Show tooltip
    showTooltip(event, d);
  })
  .on('mouseleave', function(event, d) {
    // Reset node
    d3.select(this)
      .select('circle')
      .transition()
      .duration(200)
      .attr('r', 40)
      .attr('stroke-width', 2);

    // Reset edges
    edgeElements
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // Hide tooltip
    hideTooltip();
  });
```

**Features**:
- Highlight node
- Highlight incoming/outgoing edges
- Show tooltip with job info
- Smooth transitions

---

### 4. Click to Select

**Implementation**:
```typescript
nodeElements.on('click', (event, d) => {
  event.stopPropagation(); // Prevent deselection

  // Update selected state
  setSelectedNode(d);

  // Visual feedback
  nodeElements.classed('selected', false);
  d3.select(event.currentTarget).classed('selected', true);

  // Open detail panel
  openNodeDetailPanel(d);
});

// Click background to deselect
svg.on('click', () => {
  setSelectedNode(null);
  nodeElements.classed('selected', false);
  closeNodeDetailPanel();
});
```

---

### 5. Double-Click to Expand

**Use Case**: Hierarchical layout with collapsible nodes

**Implementation**:
```typescript
nodeElements.on('dblclick', (event, d) => {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update(d);
});
```

---

### 6. Keyboard Navigation

**Accessibility feature**

**Implementation**:
```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!selectedNode) return;

    switch (event.key) {
      case 'ArrowUp':
        selectPreviousNode();
        break;
      case 'ArrowDown':
        selectNextNode();
        break;
      case 'Enter':
        openNodeDetailPanel(selectedNode);
        break;
      case 'Escape':
        closeNodeDetailPanel();
        break;
      case '+':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedNode]);
```

---

## Tooltip Design

**Position**: Near cursor, avoiding edges

**Content**:
```
┌─────────────────────┐
│  Build              │  ← Job name
├─────────────────────┤
│ Status: Success ✓   │  ← Status
│ Duration: 2m 34s    │  ← Duration
│ Dependencies: 1     │  ← Dep count
└─────────────────────┘
```

**Implementation**:
```typescript
function showTooltip(event: MouseEvent, node: NodeDatum) {
  const tooltip = d3.select('#tooltip')
    .style('opacity', 0)
    .style('display', 'block');

  tooltip.html(`
    <div class="font-bold">${node.name}</div>
    <div>Status: ${node.status}</div>
    <div>Duration: ${formatDuration(node.duration)}</div>
    <div>Dependencies: ${node.dependencies.length}</div>
  `);

  // Position tooltip
  const x = event.pageX + 10;
  const y = event.pageY - 10;

  tooltip
    .style('left', `${x}px`)
    .style('top', `${y}px`)
    .transition()
    .duration(200)
    .style('opacity', 1);
}
```

---

## Animations

### 1. Initial Render

**Nodes fade in and scale up**:
```typescript
nodeEnter
  .append('circle')
  .attr('r', 0)
  .attr('opacity', 0)
  .transition()
  .duration(500)
  .attr('r', 40)
  .attr('opacity', 1);
```

### 2. Layout Change

**Smooth transition between layouts**:
```typescript
function changeLayout(newLayout: GraphLayout) {
  const newPositions = calculatePositions(newLayout);

  nodeElements
    .transition()
    .duration(1000)
    .attr('transform', d => `translate(${newPositions[d.id].x}, ${newPositions[d.id].y})`);

  edgeElements
    .transition()
    .duration(1000)
    .attr('x1', d => newPositions[d.source.id].x)
    .attr('y1', d => newPositions[d.source.id].y)
    .attr('x2', d => newPositions[d.target.id].x)
    .attr('y2', d => newPositions[d.target.id].y);
}
```

### 3. Status Update (Real-time)

**Node color change animation**:
```typescript
function updateNodeStatus(nodeId: string, newStatus: Status) {
  d3.select(`.node[data-id="${nodeId}"] circle`)
    .transition()
    .duration(300)
    .attr('fill', getColorForStatus(newStatus));

  // Add pulse effect
  d3.select(`.node[data-id="${nodeId}"] circle`)
    .transition()
    .duration(500)
    .attr('r', 50)
    .transition()
    .duration(500)
    .attr('r', 40);
}
```

### 4. Critical Path Highlight

**Animated dashed stroke**:
```css
@keyframes dash {
  to {
    stroke-dashoffset: -20;
  }
}

.edge-critical {
  stroke-dasharray: 5, 5;
  animation: dash 1s linear infinite;
}
```

---

## Performance Optimizations

### 1. Canvas Fallback for Large Graphs

**Threshold**: 200+ nodes

**Implementation**:
```typescript
function PipelineGraph({ pipeline }: Props) {
  const nodeCount = pipeline.jobs.length;

  if (nodeCount > 200) {
    return <CanvasGraph pipeline={pipeline} />;
  }

  return <SVGGraph pipeline={pipeline} />;
}
```

### 2. Level of Detail (LOD)

**Hide labels when zoomed out**:
```typescript
zoom.on('zoom', (event) => {
  const scale = event.transform.k;

  // Hide text labels below 50% zoom
  nodeElements.select('text')
    .style('opacity', scale < 0.5 ? 0 : 1);
});
```

### 3. Debounce Re-renders

```typescript
const debouncedUpdate = useMemo(
  () => debounce(() => updateGraph(), 100),
  []
);
```

### 4. Memoize Node/Edge Calculations

```typescript
const graphData = useMemo(() => {
  return transformPipelineToGraph(pipeline);
}, [pipeline.id]); // Only recalculate if pipeline changes
```

---

## Minimap (Optional Feature)

**Position**: Bottom-right corner

**Purpose**: Navigate large graphs

**Implementation**:
```typescript
function Minimap({ nodes, edges, viewBox }: MinimapProps) {
  const minimapScale = 0.1;

  return (
    <svg className="minimap" width={150} height={100}>
      <g transform={`scale(${minimapScale})`}>
        {/* Render simplified version */}
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={5}
            fill="#3b82f6"
          />
        ))}

        {/* Viewport rectangle */}
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="none"
          stroke="#ef4444"
          stroke-width="2"
        />
      </g>
    </svg>
  );
}
```

---

## Export Functionality

### 1. Export as SVG

```typescript
function exportAsSVG() {
  const svgElement = document.querySelector('svg');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'pipeline-graph.svg';
  link.click();

  URL.revokeObjectURL(url);
}
```

### 2. Export as PNG

```typescript
function exportAsPNG() {
  const svgElement = document.querySelector('svg');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const svgString = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pipeline-graph.png';
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
}
```

### 3. Export as JSON

```typescript
function exportAsJSON() {
  const data = {
    nodes: nodes.map(n => ({ id: n.id, name: n.name, ...n })),
    edges: edges.map(e => ({ source: e.source.id, target: e.target.id })),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'pipeline-data.json';
  link.click();

  URL.revokeObjectURL(url);
}
```

---

## Responsive Design

### Mobile Adaptations

**Breakpoint**: < 768px

**Changes**:
1. **Smaller nodes**: 30px radius instead of 40px
2. **Touch-friendly**: Larger tap targets (44x44px minimum)
3. **Simplified view**: Hide labels by default, show on tap
4. **Controls**: Floating action buttons instead of toolbar
5. **Detail panel**: Full-screen modal instead of slide-out

**Implementation**:
```typescript
const isMobile = useMediaQuery('(max-width: 768px)');

const nodeRadius = isMobile ? 30 : 40;
const fontSize = isMobile ? 10 : 14;
```

---

## Accessibility

### ARIA Attributes

```typescript
<svg role="img" aria-label="Pipeline dependency graph">
  <g className="node" role="button" aria-label="Build job" tabIndex={0}>
    {/* Node content */}
  </g>
</svg>
```

### Focus Management

```typescript
// Make nodes focusable
nodeElements.attr('tabindex', 0);

// Style focus
nodeElements.on('focus', function() {
  d3.select(this).select('circle')
    .attr('stroke', '#1e40af')
    .attr('stroke-width', 4);
});
```

### Screen Reader Announcements

```typescript
// Announce status changes
function announceStatusChange(jobName: string, status: Status) {
  const announcement = `${jobName} is now ${status}`;

  const liveRegion = document.querySelector('[aria-live="polite"]');
  if (liveRegion) {
    liveRegion.textContent = announcement;
  }
}
```

---

## Color Palette

### Node Colors

```typescript
const nodeColors = {
  pending: '#3b82f6',   // Blue
  running: '#f59e0b',   // Orange
  success: '#10b981',   // Green
  failed: '#ef4444',    // Red
  cancelled: '#6b7280', // Gray
};
```

### Dark Mode

```typescript
const darkModeColors = {
  pending: '#60a5fa',   // Lighter blue
  running: '#fbbf24',   // Lighter orange
  success: '#34d399',   // Lighter green
  failed: '#f87171',    // Lighter red
  cancelled: '#9ca3af', // Lighter gray

  background: '#1f2937', // Dark gray
  text: '#f9fafb',      // Off-white
  edge: '#4b5563',      // Medium gray
};
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('D3GraphService', () => {
  it('renders nodes and edges', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const service = new D3GraphService(svg, 800, 600);

    service.renderForceDirectedLayout(mockPipeline, {});

    expect(svg.querySelectorAll('.node')).toHaveLength(3);
    expect(svg.querySelectorAll('.edge')).toHaveLength(2);
  });

  it('updates node status', () => {
    // Test status color changes
  });
});
```

### Visual Regression Tests

```typescript
test('pipeline graph renders correctly', async ({ page }) => {
  await page.goto('/visualize');

  // Wait for graph to render
  await page.waitForSelector('svg .node');

  // Take screenshot
  await expect(page).toHaveScreenshot('pipeline-graph.png');
});
```

---

## Summary

This D3.js visualization design provides:
- ✅ Multiple layout algorithms for different use cases
- ✅ Rich interactions (zoom, pan, drag, hover, click)
- ✅ Beautiful visual design with animations
- ✅ Performance optimizations for large graphs
- ✅ Responsive design for mobile
- ✅ Full accessibility support
- ✅ Export functionality
- ✅ Real-time status updates

The visualization will be the centerpiece of the FloWiz Web application, showcasing advanced D3.js skills and attention to detail.
