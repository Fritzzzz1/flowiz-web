# FloWiz Web - Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm 10+
- Git
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/flowiz-web.git
cd flowiz-web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base components (Button, Input, Card, etc.)
│   ├── layout/      # Layout components (Header, Container)
│   └── common/      # Common components (ErrorBoundary)
├── features/        # Feature modules
│   ├── upload/      # File upload & parsing
│   ├── visualization/  # D3.js graph visualization
│   ├── dashboard/   # Analytics dashboard
│   ├── integrations/   # GitHub/GitLab integration
│   └── realtime/    # WebSocket real-time updates
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API services
├── store/           # Zustand stores
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Architecture Decisions

### State Management
- **Zustand**: Global client state (auth, theme, current pipeline)
- **React Query**: Server state (API data, caching, mutations)
- **useState**: Local component state

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Class-based with `dark:` prefix
- **Responsive**: Mobile-first breakpoints

### Type Safety
- **Strict TypeScript**: No `any` types allowed
- **Path Aliases**: `@components`, `@features`, etc.
- **Type Definitions**: Centralized in `src/types/`

## Adding New Features

### 1. Create Feature Module

```bash
# Create feature directory structure
mkdir -p src/features/my-feature/{components,hooks,services,types}
```

### 2. Add Components

```typescript
// src/features/my-feature/components/MyComponent.tsx
import { useState } from 'react';
import { Button } from '@components/ui/Button';

export interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </Button>
    </div>
  );
}
```

### 3. Add Tests

```typescript
// src/features/my-feature/components/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('increments count on click', () => {
    render(<MyComponent title="Test" />);
    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Count: 0');
    fireEvent.click(button);
    expect(button).toHaveTextContent('Count: 1');
  });
});
```

### 4. Add Types

```typescript
// src/types/my-feature.types.ts
export interface MyData {
  id: string;
  name: string;
  value: number;
}

export interface MyApiRequest {
  query: string;
}

export interface MyApiResponse {
  data: MyData[];
  total: number;
}
```

### 5. Add API Service

```typescript
// src/services/api.service.ts
import { httpService } from './http.service';
import { MyApiRequest, MyApiResponse } from '../types/my-feature.types';

export const apiService = {
  // ... existing methods

  getMyData: (request: MyApiRequest) =>
    httpService.post<MyApiResponse>('/my-endpoint', request),
};
```

### 6. Add React Query Hook

```typescript
// src/features/my-feature/hooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@services/api.service';

export function useMyData(query: string) {
  return useQuery({
    queryKey: ['my-data', query],
    queryFn: () => apiService.getMyData({ query }),
    enabled: !!query,
  });
}
```

## Testing

### Unit Tests (Vitest)

```typescript
// Test React components
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

// Test hooks
import { renderHook, waitFor } from '@testing-library/react';
import { useMyData } from './useMyData';

test('fetches data', async () => {
  const { result } = renderHook(() => useMyData('test'));

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test('user can complete workflow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Upload');
  await page.fill('textarea', 'yaml content');
  await page.click('button:has-text("Parse")');

  await expect(page).toHaveURL('/visualize');
  await expect(page.locator('svg')).toBeVisible();
});
```

## Code Style

### Component Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from '@components/ui/Button';
import { useMyData } from '../hooks/useMyData';

// 2. Types
interface Props {
  id: string;
}

// 3. Component
export function MyComponent({ id }: Props) {
  // 3a. Hooks
  const [state, setState] = useState();
  const { data } = useMyData(id);

  // 3b. Event handlers
  const handleClick = () => {
    // ...
  };

  // 3c. Effects
  useEffect(() => {
    // ...
  }, []);

  // 3d. JSX
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Services**: camelCase with `.service` suffix (`api.service.ts`)
- **Types**: camelCase with `.types` suffix (`pipeline.types.ts`)
- **Constants**: UPPER_SNAKE_CASE

### Import Order

```typescript
// 1. External libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports (with @)
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';

// 3. Relative imports
import { helper } from './utils';

// 4. Types
import { User } from '../types/user.types';
```

## Performance

### Bundle Size

```bash
# Analyze bundle
npm run build
# Check dist/ folder sizes
```

### Code Splitting

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('@pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization

```typescript
// Expensive computations
const result = useMemo(() => expensiveCalc(data), [data]);

// Component memoization
export const MyComponent = memo(({ data }) => {
  // ...
}, (prev, next) => prev.id === next.id);
```

## Accessibility

### ARIA Labels

```typescript
<button aria-label="Close modal">×</button>
<div role="dialog" aria-labelledby="title">
  <h2 id="title">Modal Title</h2>
</div>
```

### Keyboard Navigation

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      closeModal();
      break;
    case 'Enter':
      submitForm();
      break;
  }
};
```

## Troubleshooting

### Build Errors

```bash
# Clear caches
rm -rf node_modules dist
npm install
npm run build
```

### Type Errors

```bash
# Check types only
npm run type-check

# Fix import issues
# Ensure path aliases are correct in tsconfig.json and vite.config.ts
```

### Test Failures

```bash
# Run tests in watch mode
npm run test

# Update snapshots if needed
npm run test -- -u
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:
- Code style
- Pull request process
- Testing requirements
- Documentation standards
