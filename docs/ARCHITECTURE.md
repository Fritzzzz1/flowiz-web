# FloWiz Web - Architecture Documentation

## System Overview

FloWiz Web is a modern React-based web application for visualizing and analyzing CI/CD pipelines. The architecture follows React best practices with a focus on modularity, type safety, performance, and user experience.

### Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FloWiz Web Frontend                  │
├─────────────────────────────────────────────────────────┤
│  React 18+ │ TypeScript │ Vite │ Tailwind CSS │ D3.js  │
├─────────────────────────────────────────────────────────┤
│    State: Zustand + React Query │ Router: React Router │
├─────────────────────────────────────────────────────────┤
│         HTTP: Axios │ Real-time: Socket.io-client       │
├─────────────────────────────────────────────────────────┤
│  Testing: Vitest + RTL + Playwright │ CI/CD: GitHub    │
└─────────────────────────────────────────────────────────┘
                          ↓ API/WebSocket
┌─────────────────────────────────────────────────────────┐
│                  FloWiz API (Backend)                   │
│         Node.js/Go │ REST API │ WebSocket Server        │
└─────────────────────────────────────────────────────────┘
```

---

## Architecture Principles

1. **Feature-Based Organization**: Code organized by feature/domain, not by technical layer
2. **Type Safety**: Strict TypeScript with no `any` types
3. **Component Composition**: Small, reusable components that compose into complex UIs
4. **Separation of Concerns**: UI components separate from business logic
5. **Performance First**: Code splitting, lazy loading, memoization
6. **Accessibility**: WCAG 2.1 AA compliance throughout
7. **Mobile Responsive**: Mobile-first design approach
8. **Test Coverage**: >80% unit test coverage, comprehensive E2E tests

---

## Directory Structure

```
flowiz-web/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── ui/             # Base components (Button, Input, etc.)
│   │   ├── layout/         # Layout components (Header, Container)
│   │   └── common/         # Common components (ErrorBoundary)
│   ├── features/           # Feature modules (domain-driven)
│   │   ├── upload/
│   │   ├── visualization/
│   │   ├── dashboard/
│   │   ├── integrations/
│   │   └── realtime/
│   ├── pages/              # Page components (routing)
│   ├── hooks/              # Global custom hooks
│   ├── services/           # API and external services
│   ├── store/              # Global state (Zustand)
│   ├── utils/              # Utility functions
│   ├── types/              # Global TypeScript types
│   └── styles/             # Global styles
├── tests/                  # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/                   # Documentation
```

**Rationale**: Feature-based structure scales better than layer-based (components/, containers/, etc.). Each feature is self-contained with its own components, hooks, services, and types.

---

## State Management Strategy

### Three Types of State

#### 1. Global Client State (Zustand)
**Use for**: Application-wide state that needs to persist across routes

**Stores**:
```typescript
// auth.store.ts - Authentication state
{
  isAuthenticated: boolean;
  provider: 'github' | 'gitlab' | null;
  user: User | null;
  token: string | null;
}

// theme.store.ts - UI theme
{
  theme: 'light' | 'dark';
}

// pipeline.store.ts - Current working pipeline
{
  currentPipeline: ParsedPipeline | null;
}
```

**Why Zustand?**
- Lightweight (1KB)
- No boilerplate
- TypeScript-first
- No Context providers needed
- Easy testing

**Example**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (provider) => {
        // OAuth redirect logic
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('token');
      },
      setToken: (token, user) => {
        set({ isAuthenticated: true, token, user });
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
```

---

#### 2. Server State (React Query)
**Use for**: All API data (fetching, caching, synchronization)

**Query Keys Pattern**:
```typescript
['repositories']                     // All repositories
['repositories', repoId]             // Specific repository
['pipeline-runs', repoId]            // Pipeline runs for repo
['pipeline-runs', repoId, runId]     // Specific run
['dashboard', pipelineId]            // Dashboard data
```

**Custom Hooks**:
```typescript
// src/features/upload/hooks/useParseConfig.ts
export function useParseConfig() {
  const navigate = useNavigate();
  const { setPipeline } = usePipelineStore();

  return useMutation({
    mutationFn: (data: ParseRequest) => apiService.parse(data),
    onSuccess: (pipeline) => {
      setPipeline(pipeline);
      navigate('/visualize');
      showToast({ type: 'success', message: 'Pipeline parsed!' });
    },
    onError: (error) => {
      showToast({ type: 'error', message: error.message });
    },
  });
}

// src/features/integrations/hooks/useRepositories.ts
export function useRepositories() {
  const { isAuthenticated, provider } = useAuthStore();

  return useQuery({
    queryKey: ['repositories', provider],
    queryFn: () => apiService.getRepositories(provider!),
    enabled: isAuthenticated && !!provider,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Why React Query?**
- Built-in caching
- Automatic background refetching
- Loading/error states
- Optimistic updates
- Pagination/infinite scroll support
- DevTools for debugging

---

#### 3. Local Component State (useState, useReducer)
**Use for**: UI state local to a component

**Examples**:
- Modal open/closed
- Form inputs
- Selected items
- Hover/focus states
- Accordion expanded/collapsed

```typescript
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  // Modal-specific state, no need for global store
}
```

---

### State Flow Diagram

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ├─── UI State ──────────► useState/useReducer
       │                          (local to component)
       │
       ├─── App State ─────────► Zustand Store
       │                          (auth, theme, etc.)
       │
       └─── Server Data ───────► React Query
                                  (API requests)
                                  │
                                  ├─── Cache Hit ───► Return cached data
                                  │
                                  └─── Cache Miss ──► Fetch from API
                                                       │
                                                       ├─── Success ──► Update cache
                                                       │
                                                       └─── Error ───► Error state
```

---

## API Integration Layer

### HTTP Service Architecture

```
Component
   │
   ├─── Custom Hook (useParseConfig)
   │       │
   │       └─── React Query (useMutation/useQuery)
   │               │
   │               └─── API Service (apiService.parse)
   │                       │
   │                       └─── HTTP Service (httpService.post)
   │                               │
   │                               └─── Axios
   │                                     │
   │                                     └─── Backend API
```

### HTTP Service (`src/services/http.service.ts`)

**Responsibilities**:
- Axios instance configuration
- Request/response interceptors
- Token injection
- Error handling
- Retry logic

```typescript
class HttpService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request: Add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response: Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect to login
          useAuthStore.getState().logout();
          window.location.href = '/';
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: any): ApiError {
    return {
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status,
      details: error.response?.data?.details,
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // ... post, put, delete methods
}
```

### API Service (`src/services/api.service.ts`)

**Responsibilities**:
- Define all API endpoints
- Type-safe request/response
- Business logic layer

```typescript
export const apiService = {
  // Parse endpoints
  parse: (data: ParseRequest) =>
    httpService.post<ParseResponse>('/parse', data),

  validate: (data: ParseRequest) =>
    httpService.post<ValidationResponse>('/validate', data),

  // Analysis endpoints
  analyze: (pipelineId: string) =>
    httpService.get<AnalysisResponse>(`/analysis/${pipelineId}`),

  getBottlenecks: (pipelineId: string) =>
    httpService.get<Bottleneck[]>(`/analysis/${pipelineId}/bottlenecks`),

  // GitHub endpoints
  githubAuth: () =>
    httpService.get<{ url: string }>('/integrations/github/auth'),

  githubCallback: (code: string) =>
    httpService.post<AuthResponse>('/integrations/github/callback', { code }),

  getGitHubRepositories: () =>
    httpService.get<Repository[]>('/integrations/github/repositories'),

  getGitHubPipelineRuns: (repoId: string) =>
    httpService.get<PipelineRun[]>(`/integrations/github/repositories/${repoId}/runs`),

  // GitLab endpoints
  // ... similar structure

  // Dashboard endpoints
  getDashboardData: (pipelineId: string) =>
    httpService.get<DashboardData>(`/dashboard/${pipelineId}`),
};
```

### Error Handling Strategy

**Levels**:
1. **HTTP Service**: Global error normalization, 401 handling
2. **React Query**: Per-request error handling in `onError`
3. **Component**: Display error UI, show toast notifications
4. **Error Boundary**: Catch React errors, display fallback UI

**Example**:
```typescript
function UploadPage() {
  const parseConfig = useParseConfig();

  const handleParse = async () => {
    try {
      await parseConfig.mutateAsync({ platform, yamlContent });
      // Success handled in hook's onSuccess
    } catch (error) {
      // Error already shown via toast in hook's onError
      // Optional: component-specific error handling
    }
  };

  if (parseConfig.error) {
    return <ErrorMessage error={parseConfig.error} />;
  }

  // ...
}
```

---

## D3.js Visualization Architecture

### Design Philosophy

**Goals**:
- Interactive, responsive graph visualization
- Multiple layout algorithms
- Smooth animations
- High performance (100+ nodes)
- Accessible (keyboard navigation, ARIA)

### Architecture Layers

```
PipelineGraph Component (React)
        │
        ├─── useD3Graph Hook
        │       │
        │       ├─── D3GraphService
        │       │     │
        │       │     ├─── Layout Engine
        │       │     │   ├─── Force-directed (d3.forceSimulation)
        │       │     │   ├─── Hierarchical (d3.tree)
        │       │     │   └─── Timeline (custom)
        │       │     │
        │       │     ├─── Rendering
        │       │     │   ├─── Nodes (circles + text)
        │       │     │   ├─── Edges (lines + arrows)
        │       │     │   └─── Minimap (optional)
        │       │     │
        │       │     └─── Interactions
        │       │         ├─── Zoom/Pan
        │       │         ├─── Drag
        │       │         ├─── Hover
        │       │         └─── Click
        │       │
        │       └─── State Management
        │             ├─── selectedNode
        │             ├─── hoveredNode
        │             ├─── zoom level
        │             └─── current layout
        │
        └─── Child Components
              ├─── GraphControls
              ├─── NodeDetailPanel
              └─── GraphTooltip
```

### D3 Graph Service

**Pattern**: Separate D3 logic from React components

```typescript
// src/features/visualization/services/d3-graph.service.ts

export class D3GraphService {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g: d3.Selection<SVGGElement, unknown, null, undefined>;
  private zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private simulation: d3.Simulation<NodeDatum, EdgeDatum> | null = null;

  constructor(
    svgElement: SVGSVGElement,
    width: number,
    height: number,
    options: GraphOptions = {}
  ) {
    this.svg = d3.select(svgElement);
    this.g = this.svg.append('g').attr('class', 'graph-container');
    this.setupZoom(width, height);
    this.setupArrowMarkers();
  }

  private setupZoom(width: number, height: number) {
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });

    this.svg
      .call(this.zoom)
      .call(this.zoom.transform, d3.zoomIdentity); // Reset to center
  }

  private setupArrowMarkers() {
    this.svg.append('defs')
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
      .attr('fill', '#999');
  }

  renderForceDirectedLayout(pipeline: ParsedPipeline, options: LayoutOptions) {
    const { nodes, edges } = this.transformPipelineData(pipeline);

    // Create force simulation
    this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(options.width / 2, options.height / 2))
      .force('collision', d3.forceCollide().radius(50));

    this.renderEdges(edges);
    this.renderNodes(nodes);

    this.simulation.on('tick', () => {
      this.updatePositions();
    });
  }

  renderHierarchicalLayout(pipeline: ParsedPipeline, options: LayoutOptions) {
    const { nodes, edges } = this.transformPipelineData(pipeline);
    const root = this.buildHierarchy(nodes, edges);

    const treeLayout = d3.tree<NodeDatum>()
      .size([options.width, options.height])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2));

    const treeData = treeLayout(root);

    this.renderEdges(treeData.links());
    this.renderNodes(treeData.descendants());
  }

  renderTimelineLayout(pipeline: ParsedPipeline, options: LayoutOptions) {
    // Custom Gantt-style layout
    // Jobs positioned based on start time and dependencies
    // X-axis: time, Y-axis: parallel tracks
  }

  private renderNodes(nodes: NodeDatum[]) {
    const node = this.g.selectAll('.node')
      .data(nodes, (d: any) => d.id)
      .join(
        (enter) => {
          const g = enter.append('g')
            .attr('class', 'node')
            .attr('cursor', 'pointer')
            .call(this.setupDrag());

          g.append('circle')
            .attr('r', 0)
            .attr('fill', (d) => this.getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .attr('r', 40);

          g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', '#fff')
            .attr('font-size', '12px')
            .text((d) => this.truncateLabel(d.name, 10));

          return g;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    return node;
  }

  private renderEdges(edges: EdgeDatum[]) {
    const link = this.g.selectAll('.edge')
      .data(edges, (d: any) => `${d.source.id}-${d.target.id}`)
      .join(
        (enter) => enter.append('line')
          .attr('class', 'edge')
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)')
          .attr('opacity', 0)
          .transition()
          .duration(500)
          .attr('opacity', 1),
        (update) => update,
        (exit) => exit.remove()
      );

    return link;
  }

  private setupDrag() {
    return d3.drag<SVGGElement, NodeDatum>()
      .on('start', this.onDragStart.bind(this))
      .on('drag', this.onDrag.bind(this))
      .on('end', this.onDragEnd.bind(this));
  }

  private onDragStart(event: any, d: NodeDatum) {
    if (!event.active && this.simulation) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  private onDrag(event: any, d: NodeDatum) {
    d.fx = event.x;
    d.fy = event.y;
  }

  private onDragEnd(event: any, d: NodeDatum) {
    if (!event.active && this.simulation) {
      this.simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }

  private getNodeColor(node: NodeDatum): string {
    if (node.status === 'success') return '#10b981'; // Green
    if (node.status === 'failed') return '#ef4444'; // Red
    if (node.status === 'running') return '#f59e0b'; // Orange
    return '#3b82f6'; // Blue (pending/default)
  }

  zoomIn() {
    this.svg.transition().call(this.zoom.scaleBy, 1.3);
  }

  zoomOut() {
    this.svg.transition().call(this.zoom.scaleBy, 0.7);
  }

  resetZoom() {
    this.svg.transition().call(
      this.zoom.transform,
      d3.zoomIdentity
    );
  }

  destroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
    this.svg.selectAll('*').remove();
  }
}
```

### Custom Hook Pattern

```typescript
// src/features/visualization/hooks/useD3Graph.ts

export function useD3Graph(
  pipeline: ParsedPipeline | null,
  layout: GraphLayout = 'force'
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const graphServiceRef = useRef<D3GraphService | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize D3 service
  useEffect(() => {
    if (!svgRef.current) return;

    const graphService = new D3GraphService(
      svgRef.current,
      1200,
      800
    );
    graphServiceRef.current = graphService;
    setIsReady(true);

    return () => {
      graphService.destroy();
      graphServiceRef.current = null;
    };
  }, []);

  // Render graph when pipeline or layout changes
  useEffect(() => {
    if (!isReady || !pipeline || !graphServiceRef.current) return;

    const graphService = graphServiceRef.current;

    switch (layout) {
      case 'force':
        graphService.renderForceDirectedLayout(pipeline, { width: 1200, height: 800 });
        break;
      case 'hierarchical':
        graphService.renderHierarchicalLayout(pipeline, { width: 1200, height: 800 });
        break;
      case 'timeline':
        graphService.renderTimelineLayout(pipeline, { width: 1200, height: 800 });
        break;
    }
  }, [pipeline, layout, isReady]);

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
```

### Performance Optimizations

1. **Memoization**: Use `React.memo()` for expensive components
2. **Virtualization**: Only render visible nodes for large graphs (>100 nodes)
3. **Debouncing**: Debounce zoom/pan updates
4. **Web Workers**: Offload layout calculations (future)
5. **Canvas Fallback**: For very large graphs (>500 nodes), use Canvas instead of SVG

---

## Real-time Updates (WebSocket)

### WebSocket Service

```typescript
// src/features/realtime/services/websocket.service.ts

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  subscribeToPipeline(pipelineId: string, callback: (data: PipelineUpdate) => void) {
    if (!this.socket) return;

    this.socket.emit('subscribe-pipeline', pipelineId);
    this.socket.on(`pipeline:${pipelineId}:update`, callback);
  }

  unsubscribeFromPipeline(pipelineId: string) {
    if (!this.socket) return;

    this.socket.emit('unsubscribe-pipeline', pipelineId);
    this.socket.off(`pipeline:${pipelineId}:update`);
  }
}

export const wsService = new WebSocketService();
```

### Integration with D3 Visualization

```typescript
// Update node colors in real-time based on status changes

function PipelineGraph({ pipeline }: Props) {
  const { svgRef } = useD3Graph(pipeline);
  const { updates } = useWebSocket(pipeline.id);

  useEffect(() => {
    if (!updates.length) return;

    const latestUpdate = updates[updates.length - 1];

    // Update node status in D3
    d3.select(svgRef.current)
      .select(`.node[data-id="${latestUpdate.jobId}"]`)
      .select('circle')
      .transition()
      .duration(300)
      .attr('fill', getColorForStatus(latestUpdate.status));
  }, [updates]);

  return <svg ref={svgRef} />;
}
```

---

## Routing Architecture

### Route Structure

```typescript
// src/App.tsx

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/visualize" element={<Visualize />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

### Protected Routes

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/integrations" replace />;
  }

  return <>{children}</>;
}

// Usage
<Route
  path="/integrations/repositories"
  element={
    <ProtectedRoute>
      <RepositoryList />
    </ProtectedRoute>
  }
/>
```

### Data Passing Between Routes

**Method 1**: React Router state
```typescript
// Upload page
navigate('/visualize', { state: { pipeline } });

// Visualize page
const location = useLocation();
const pipeline = location.state?.pipeline;
```

**Method 2**: Global store (Zustand)
```typescript
// Upload page
const { setPipeline } = usePipelineStore();
setPipeline(parsedPipeline);
navigate('/visualize');

// Visualize page
const { currentPipeline } = usePipelineStore();
```

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

```typescript
// src/components/ui/Button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });
});
```

### Integration Tests

```typescript
// src/features/upload/Upload.integration.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Upload } from './Upload';
import { server } from '@tests/mocks/server';
import { rest } from 'msw';

describe('Upload Feature', () => {
  it('uploads and parses YAML file', async () => {
    const user = userEvent.setup();

    render(<Upload />);

    // Select platform
    await user.click(screen.getByLabelText('GitHub Actions'));

    // Upload file
    const file = new File(['name: CI\njobs:\n  build:', ], 'workflow.yml');
    const input = screen.getByLabelText('Upload YAML file');
    await user.upload(input, file);

    // Click parse button
    await user.click(screen.getByRole('button', { name: 'Parse Configuration' }));

    // Verify loading state
    expect(screen.getByText('Parsing...')).toBeInTheDocument();

    // Verify navigation to visualize page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/visualize');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/upload-and-visualize.spec.ts

import { test, expect } from '@playwright/test';

test('complete upload to visualization flow', async ({ page }) => {
  await page.goto('/');

  // Navigate to upload
  await page.click('text=Upload');

  // Select platform
  await page.click('input[value="github"]');

  // Paste YAML
  await page.fill('textarea[name="yaml"]', `
name: CI
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  `);

  // Parse
  await page.click('button:has-text("Parse Configuration")');

  // Wait for visualization page
  await expect(page).toHaveURL('/visualize');

  // Verify graph rendered
  await expect(page.locator('svg')).toBeVisible();

  // Verify nodes
  await expect(page.locator('.node')).toHaveCount(2);

  // Click node to open detail panel
  await page.click('.node:first-child');
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});
```

---

## Performance Optimization Techniques

### Code Splitting

```typescript
// Lazy load pages
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Visualize = lazy(() => import('@pages/Visualize'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/visualize" element={<Visualize />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization

```typescript
// Expensive computations
const criticalPath = useMemo(() => {
  return calculateCriticalPath(pipeline);
}, [pipeline]);

// Component memoization
export const PipelineGraph = memo(({ pipeline, layout }) => {
  // Render logic
}, (prevProps, nextProps) => {
  return prevProps.pipeline.id === nextProps.pipeline.id &&
         prevProps.layout === nextProps.layout;
});
```

### Virtualization (for large lists)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function RepositoryList({ repositories }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: repositories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} style={{ height: item.size }}>
            <RepositoryCard repository={repositories[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Build & Deployment

### Vite Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'd3-vendor': ['d3'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### Docker Multi-Stage Build

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Security Considerations

1. **XSS Prevention**: React escapes all rendered content by default
2. **Token Storage**: Store JWT in httpOnly cookie (backend) or secure localStorage
3. **CORS**: Configure backend to whitelist frontend origin
4. **CSP Headers**: Set via Nginx to prevent inline scripts
5. **Input Sanitization**: Validate all user inputs before API calls
6. **OAuth Flow**: Use PKCE for enhanced security

---

## Accessibility Guidelines

1. **Semantic HTML**: Use `<nav>`, `<main>`, `<section>`, `<article>`
2. **ARIA Labels**: Add `aria-label` to icon buttons
3. **Keyboard Navigation**: All interactive elements focusable with Tab
4. **Focus Indicators**: Visible focus rings (outline)
5. **Color Contrast**: WCAG AA minimum (4.5:1 for text)
6. **Screen Readers**: ARIA live regions for dynamic content

---

## Summary

This architecture provides:
- ✅ Scalable feature-based structure
- ✅ Type-safe TypeScript throughout
- ✅ Efficient state management (Zustand + React Query)
- ✅ Powerful D3.js visualizations
- ✅ Real-time WebSocket updates
- ✅ Comprehensive testing strategy
- ✅ Performance optimizations
- ✅ Production-ready deployment
- ✅ Accessibility compliance

The foundation is set for a professional, portfolio-quality React application.
