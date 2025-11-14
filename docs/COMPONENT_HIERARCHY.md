# FloWiz Web - Component Hierarchy

## Overview
This document defines the complete component tree, props interfaces, and composition patterns for the FloWiz Web application.

## Component Tree

```
App
├── QueryClientProvider (React Query)
├── ThemeProvider (Custom)
└── BrowserRouter
    ├── Layout
    │   ├── Header
    │   │   ├── Logo
    │   │   ├── Navigation
    │   │   │   ├── NavLink (x5)
    │   │   │   └── MobileMenu
    │   │   └── ThemeToggle
    │   ├── Sidebar (optional, desktop)
    │   │   └── NavigationLinks
    │   └── Container
    │       └── Routes
    │           ├── Home
    │           ├── Upload
    │           ├── Visualize
    │           ├── Dashboard
    │           ├── Integrations
    │           └── NotFound
    └── GlobalComponents
        ├── Toast Container
        └── ErrorBoundary
```

## Page Components

### 1. Home Page (`src/pages/Home.tsx`)
**Purpose**: Landing page with feature overview and quick start

**Component Tree**:
```
Home
├── Hero Section
│   ├── Heading
│   ├── Description
│   └── CTAButtons (Upload, Browse Demo)
├── Features Grid
│   └── FeatureCard (x6)
│       ├── Icon
│       ├── Title
│       └── Description
└── Quick Start Section
    └── StepCard (x3)
```

**Props**: None (root page)

---

### 2. Upload Page (`src/pages/Upload.tsx`)
**Purpose**: YAML file upload and parsing interface

**Component Tree**:
```
Upload
├── PageHeader
│   ├── Title
│   └── Description
├── PlatformSelector
│   ├── RadioButton (GitHub Actions)
│   └── RadioButton (GitLab CI)
├── FileUploadZone
│   ├── FileUpload (drag & drop)
│   ├── Divider ("or")
│   └── YAMLEditor (manual paste)
├── ValidationStatus
│   ├── SuccessMessage
│   └── ErrorList
└── ActionButtons
    ├── Button (Clear)
    ├── Button (Validate)
    └── Button (Parse & Visualize)
```

**State Management**:
- Local state: `platform`, `yamlContent`, `validationErrors`
- API mutation: `useParseConfig()`

**Props Interfaces**:
```typescript
interface UploadPageState {
  platform: 'github' | 'gitlab';
  yamlContent: string;
  validationErrors: ValidationError[] | null;
}
```

---

### 3. Visualize Page (`src/pages/Visualize.tsx`)
**Purpose**: Interactive D3.js pipeline graph visualization

**Component Tree**:
```
Visualize
├── PageHeader
│   ├── PipelineName
│   └── MetadataBadges (Platform, Jobs Count, etc.)
├── GraphControls
│   ├── ZoomControls
│   │   ├── Button (Zoom In)
│   │   ├── Button (Zoom Out)
│   │   └── Button (Reset)
│   ├── LayoutSelector
│   │   ├── Dropdown
│   │   └── Options (Force, Hierarchical, Timeline)
│   └── ExportButton
│       └── Dropdown (SVG, PNG, JSON)
├── PipelineGraph
│   ├── SVG Canvas
│   │   ├── NodeGroup (per job)
│   │   │   ├── Circle (node)
│   │   │   ├── Text (label)
│   │   │   └── StatusIcon
│   │   ├── EdgeGroup (per dependency)
│   │   │   ├── Line (arrow)
│   │   │   └── Marker (arrowhead)
│   │   └── Minimap (optional)
│   └── GraphTooltip (hover)
└── NodeDetailPanel (slide-out)
    ├── PanelHeader
    │   ├── JobName
    │   └── CloseButton
    ├── PanelContent
    │   ├── Overview Section
    │   │   ├── StatusBadge
    │   │   ├── Duration
    │   │   └── Platform
    │   ├── Dependencies Section
    │   │   └── DependencyList
    │   ├── Steps Section
    │   │   └── StepList
    │   └── Environment Section
    │       └── EnvVarList
    └── Actions
        └── Button (View Raw YAML)
```

**State Management**:
- Router state: `pipeline` (from Upload or Integrations)
- Local state: `selectedNode`, `layout`, `zoom`
- Custom hooks: `useD3Graph()`, `useGraphLayout()`, `useZoomPan()`

**Props Interfaces**:
```typescript
interface VisualizePageProps {
  // Receives pipeline via React Router location state
}

interface PipelineGraphProps {
  pipeline: ParsedPipeline;
  layout: 'force' | 'hierarchical' | 'timeline';
  onNodeClick: (node: Job) => void;
  onNodeHover: (node: Job | null) => void;
}

interface NodeDetailPanelProps {
  node: Job | null;
  isOpen: boolean;
  onClose: () => void;
}
```

---

### 4. Dashboard Page (`src/pages/Dashboard.tsx`)
**Purpose**: Analytics and insights about pipelines

**Component Tree**:
```
Dashboard
├── PageHeader
├── StatsGrid
│   ├── StatCard (Total Jobs)
│   ├── StatCard (Avg Execution Time)
│   ├── StatCard (Parallel Jobs)
│   └── StatCard (Critical Path)
├── ChartsGrid
│   ├── ExecutionTimeChart
│   │   └── BarChart (D3 or Recharts)
│   ├── SuccessRateChart
│   │   └── DonutChart
│   └── JobDistributionChart
│       └── PieChart
└── BottleneckSection
    ├── SectionHeader
    └── BottleneckList
        └── BottleneckCard (x N)
            ├── JobName
            ├── ImpactScore
            └── LinkToVisualization
```

**State Management**:
- React Query: `useDashboardData(pipelineId)`
- Local state: `selectedMetric`, `timeRange`

---

### 5. Integrations Page (`src/pages/Integrations.tsx`)
**Purpose**: OAuth authentication and repository browsing

**Component Tree**:
```
Integrations
├── PageHeader
├── AuthSection (if not authenticated)
│   ├── GitHubAuthCard
│   │   ├── Icon
│   │   ├── Description
│   │   └── Button (Connect GitHub)
│   └── GitLabAuthCard
│       ├── Icon
│       ├── Description
│       └── Button (Connect GitLab)
└── ConnectedSection (if authenticated)
    ├── UserProfile
    │   ├── Avatar
    │   ├── Username
    │   └── Button (Disconnect)
    ├── RepositoryList
    │   ├── SearchInput
    │   ├── FilterDropdown
    │   └── RepositoryGrid
    │       └── RepositoryCard (x N)
    │           ├── RepoIcon
    │           ├── RepoName
    │           ├── RepoDescription
    │           └── Button (View Pipelines)
    └── PipelineHistory (when repo selected)
        ├── SectionHeader
        └── PipelineRunList
            └── PipelineRunCard (x N)
                ├── RunNumber
                ├── StatusBadge
                ├── CommitInfo
                ├── Timestamp
                └── Button (Visualize)
```

**State Management**:
- Zustand store: `useAuthStore()` (global auth state)
- React Query: `useRepositories()`, `usePipelineRuns(repoId)`
- Local state: `selectedRepo`, `searchQuery`, `filter`

---

## Base UI Components (`src/components/ui/`)

### Button (`Button.tsx`)
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Variants**:
- `primary`: Blue background, white text
- `secondary`: Gray background, dark text
- `ghost`: Transparent, border only
- `danger`: Red background, white text

**States**: default, hover, active, disabled, loading

---

### Input (`Input.tsx`)
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}
```

**Variants**:
- Default
- Error state (red border, error message)
- Disabled
- With icons

---

### Card (`Card.tsx`)
```typescript
interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
  onClick?: () => void;
}
```

---

### Modal (`Modal.tsx`)
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}
```

**Features**:
- Portal rendering (outside root)
- Focus trap
- Scroll lock
- Backdrop click to close
- ESC key to close
- Smooth animations

---

### Toast (`Toast.tsx`)
```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

interface ToastContextValue {
  showToast: (options: Omit<ToastProps, 'id' | 'onDismiss'>) => void;
  dismissToast: (id: string) => void;
}
```

**Usage Pattern**:
```typescript
const { showToast } = useToast();

showToast({
  type: 'success',
  message: 'Pipeline parsed successfully!',
  duration: 3000
});
```

---

### Loading (`Loading.tsx`)
```typescript
// Spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// Skeleton
interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: string;
}
```

---

## Feature Components

### Upload Feature (`src/features/upload/`)

#### FileUpload (`components/FileUpload.tsx`)
```typescript
interface FileUploadProps {
  onFileSelect: (content: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

interface FileUploadState {
  isDragActive: boolean;
  fileName: string | null;
  error: string | null;
}
```

**Features**:
- Drag and drop zone
- File input fallback
- File type validation
- File size validation
- Visual feedback (drag active, success, error)

---

#### YAMLEditor (`components/YAMLEditor.tsx`)
```typescript
interface YAMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readonly?: boolean;
  lineNumbers?: boolean;
  syntaxHighlight?: boolean;
}
```

**Features**:
- Monospace font
- Optional syntax highlighting
- Line numbers
- Tab support (insert 2 spaces)
- Auto-resize textarea
- Character/line count

---

#### PlatformSelector (`components/PlatformSelector.tsx`)
```typescript
interface PlatformSelectorProps {
  value: 'github' | 'gitlab';
  onChange: (platform: 'github' | 'gitlab') => void;
}
```

**Features**:
- Radio button group or toggle
- Platform icons
- Platform descriptions
- Keyboard accessible

---

### Visualization Feature (`src/features/visualization/`)

#### PipelineGraph (`components/PipelineGraph.tsx`)
```typescript
interface PipelineGraphProps {
  pipeline: ParsedPipeline;
  layout?: GraphLayout;
  width?: number;
  height?: number;
  onNodeClick?: (node: Job) => void;
  onNodeHover?: (node: Job | null) => void;
  className?: string;
}

type GraphLayout = 'force' | 'hierarchical' | 'timeline';

interface Job {
  id: string;
  name: string;
  status?: 'pending' | 'running' | 'success' | 'failed';
  duration?: number;
  dependencies: string[];
  steps: Step[];
  environment: Record<string, string>;
}
```

**D3 Integration**:
- Uses `useD3Graph()` custom hook
- Force simulation for physics-based layout
- D3 hierarchical layout for tree structure
- Custom timeline layout for Gantt-style

---

#### GraphControls (`components/GraphControls.tsx`)
```typescript
interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onLayoutChange: (layout: GraphLayout) => void;
  onExport: (format: 'svg' | 'png' | 'json') => void;
  currentLayout: GraphLayout;
  currentZoom: number;
}
```

---

#### NodeDetailPanel (`components/NodeDetailPanel.tsx`)
```typescript
interface NodeDetailPanelProps {
  node: Job | null;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
}
```

**Features**:
- Slide-in animation
- Close on backdrop click
- Close on ESC key
- Tabbed content (Overview, Steps, Dependencies, Environment)
- Copy buttons for IDs, commands

---

### Dashboard Feature (`src/features/dashboard/`)

#### StatCard (`components/StatCard.tsx`)
```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}
```

---

#### ExecutionTimeChart (`components/ExecutionTimeChart.tsx`)
```typescript
interface ExecutionTimeChartProps {
  jobs: Array<{
    name: string;
    duration: number;
    isCriticalPath: boolean;
  }>;
  highlightCriticalPath?: boolean;
}
```

**Library**: Recharts or D3

---

### Integrations Feature (`src/features/integrations/`)

#### GitHubAuth (`components/GitHubAuth.tsx`)
```typescript
interface GitHubAuthProps {
  onAuthSuccess?: (user: User) => void;
  onAuthError?: (error: Error) => void;
}
```

**Flow**:
1. Click "Connect GitHub" button
2. Redirect to GitHub OAuth
3. Callback to `/auth/callback?code=...`
4. Exchange code for token
5. Store in auth store
6. Redirect to integrations page

---

#### RepositoryList (`components/RepositoryList.tsx`)
```typescript
interface RepositoryListProps {
  provider: 'github' | 'gitlab';
}

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  hasWorkflows: boolean;
  lastUpdated: string;
}
```

**Features**:
- Search/filter
- Pagination or infinite scroll
- Skeleton loading states
- Empty state (no repos)

---

### Real-time Feature (`src/features/realtime/`)

#### StatusIndicator (`components/StatusIndicator.tsx`)
```typescript
interface StatusIndicatorProps {
  isConnected: boolean;
  reconnecting?: boolean;
}
```

**States**:
- Connected (green dot)
- Disconnected (red dot)
- Reconnecting (yellow dot, pulsing)

---

#### LiveUpdateBanner (`components/LiveUpdateBanner.tsx`)
```typescript
interface LiveUpdateBannerProps {
  updates: PipelineUpdate[];
  onDismiss: () => void;
  onViewUpdate: (update: PipelineUpdate) => void;
}
```

---

## Layout Components (`src/components/layout/`)

### Header (`Header.tsx`)
```typescript
interface HeaderProps {
  currentPath: string;
}
```

**Content**:
- Logo (left)
- Navigation links (center)
  - Home
  - Upload
  - Dashboard
  - Integrations
- Theme toggle (right)
- User menu (right, if authenticated)

---

### Sidebar (`Sidebar.tsx`)
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Usage**: Mobile navigation drawer

---

### Container (`Container.tsx`)
```typescript
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}
```

**Purpose**: Consistent page width and padding

---

## Common Components (`src/components/common/`)

### ErrorBoundary (`ErrorBoundary.tsx`)
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}
```

**Features**:
- Catches React errors
- Displays error UI
- Reset functionality
- Logs to error tracking service (future)

---

### ProtectedRoute (`ProtectedRoute.tsx`)
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}
```

**Purpose**: Redirect to login if not authenticated

---

## State Management Patterns

### Global State (Zustand)
```typescript
// src/store/auth.store.ts
interface AuthState {
  isAuthenticated: boolean;
  provider: 'github' | 'gitlab' | null;
  user: User | null;
  token: string | null;
  login: (provider: 'github' | 'gitlab') => void;
  logout: () => void;
  setToken: (token: string, user: User) => void;
}

// src/store/theme.store.ts
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// src/store/pipeline.store.ts
interface PipelineState {
  currentPipeline: ParsedPipeline | null;
  setPipeline: (pipeline: ParsedPipeline) => void;
  clearPipeline: () => void;
}
```

### Server State (React Query)
```typescript
// Custom hooks pattern
export function useParseConfig() {
  return useMutation({
    mutationFn: (data: ParseRequest) => apiService.parse(data),
  });
}

export function useRepositories() {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: () => apiService.getGitHubRepositories(),
    enabled: isAuthenticated, // Only fetch if authenticated
  });
}

export function usePipelineRuns(repoId: string) {
  return useQuery({
    queryKey: ['pipeline-runs', repoId],
    queryFn: () => apiService.getPipelineRuns(repoId),
  });
}
```

### Local State (useState)
- UI state (modals open/closed, selected items)
- Form state (inputs, validation)
- Transient state (hover, focus)

---

## Responsive Breakpoints

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

**Responsive Patterns**:
- Mobile: Stack vertically, hamburger menu, full-width cards
- Tablet: 2-column grid, visible sidebar
- Desktop: 3-4 column grid, full navigation, side panels

---

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts (optional)

### ARIA Labels
```typescript
<button aria-label="Close modal">×</button>
<div role="dialog" aria-labelledby="modal-title">...</div>
<nav aria-label="Main navigation">...</nav>
```

### Screen Reader Support
- Semantic HTML (nav, main, section, article)
- Alt text for images
- ARIA live regions for dynamic content
- Skip to main content link

---

## Animation Guidelines

### Transitions
- Duration: 150-300ms
- Easing: ease-in-out
- Properties: transform, opacity

### Animations
- Fade in: opacity 0 → 1
- Slide in: transform translateX/Y
- Scale: transform scale(0.95 → 1)
- Spin (loading): rotate 360deg

**Example**:
```typescript
// Tailwind classes
'transition-all duration-200 ease-in-out'
'hover:scale-105'
'animate-spin'
```

---

## Component Design Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props over State**: Keep components stateless when possible
4. **Accessibility First**: ARIA labels, keyboard support
5. **Performance**: Memoization, lazy loading, code splitting
6. **Type Safety**: Strict TypeScript, no `any`
7. **Testing**: Unit tests for logic, integration tests for flows

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `PipelineGraph.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useD3Graph.ts`)
- **Services**: camelCase with `.service` suffix (e.g., `api.service.ts`)
- **Stores**: camelCase with `.store` suffix (e.g., `auth.store.ts`)
- **Types**: camelCase with `.types` suffix (e.g., `pipeline.types.ts`)
- **Utils**: camelCase (e.g., `formatters.ts`, `validators.ts`)

---

## Import Aliases

```typescript
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { apiService } from '@services/api.service';
import { useAuthStore } from '@store/auth.store';
import { ParseRequest } from '@types/api.types';
```

---

This component hierarchy provides a clear roadmap for building the FloWiz Web application with consistent patterns and best practices.
