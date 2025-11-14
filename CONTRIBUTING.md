# Contributing to FloWiz Web

Thank you for considering contributing to FloWiz Web! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/flowiz-web.git
   cd flowiz-web
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/flowiz-web.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Make Your Changes

- Follow the existing code style
- Write TypeScript with strict typing (no `any`)
- Use functional components and hooks
- Keep components small and focused

### 2. Write Tests

- Add unit tests for new components/functions
- Add integration tests for new features
- Ensure all tests pass:
  ```bash
  npm run test
  npm run test:e2e
  ```

### 3. Lint and Format

```bash
npm run lint:fix
npm run format
npm run type-check
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(visualization): add timeline layout option"
git commit -m "fix(upload): handle YAML parsing errors"
git commit -m "docs: update installation instructions"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Use the same format as commit messages:
```
feat(scope): description
```

### PR Description

Include:
- **What**: Description of changes
- **Why**: Motivation and context
- **How**: Implementation approach
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes (before/after)

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if needed)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Accessibility considered (ARIA labels, keyboard nav)
- [ ] Responsive design tested (mobile, tablet, desktop)

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### React Components

- Use functional components
- Use TypeScript for prop types
- Prefer named exports
- Keep components under 200 lines
- Extract complex logic into custom hooks

### File Naming

- Components: `PascalCase.tsx` (e.g., `Button.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.types.ts` (e.g., `pipeline.types.ts`)

### Import Order

```typescript
// 1. External libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal absolute imports (with @)
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';

// 3. Relative imports
import { helper } from './utils';

// 4. Types
import type { User } from '@types/user.types';

// 5. Styles (if not using CSS-in-JS)
import styles from './Component.module.css';
```

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { Button } from '@components/ui/Button';

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState();
  const navigate = useNavigate();

  // 3b. Event handlers
  const handleClick = () => {
    // ...
  };

  // 3c. Effects
  useEffect(() => {
    // ...
  }, []);

  // 3d. Render helpers
  const renderItem = (item) => {
    // ...
  };

  // 3e. JSX
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## Testing Guidelines

### Unit Tests

```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Component onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests

```typescript
// flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can upload and visualize pipeline', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Upload');

  // Upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('fixtures/workflow.yml');

  // Parse
  await page.click('button:has-text("Parse")');

  // Verify visualization
  await expect(page).toHaveURL('/visualize');
  await expect(page.locator('svg')).toBeVisible();
});
```

## Accessibility Guidelines

- Use semantic HTML (`nav`, `main`, `section`, `article`)
- Add ARIA labels to icon buttons: `<button aria-label="Close">×</button>`
- Ensure keyboard navigation works (Tab, Enter, Escape)
- Maintain color contrast ratio ≥ 4.5:1 (WCAG AA)
- Test with screen readers (NVDA, JAWS)
- Add focus indicators (`:focus-visible`)

## Performance Guidelines

- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` appropriately
- Lazy load routes and heavy components
- Optimize images and assets
- Keep bundle size under 500KB (gzipped)

## Documentation

When adding new features, update:

- `README.md` - If user-facing
- `docs/ARCHITECTURE.md` - If changing architecture
- `docs/COMPONENT_HIERARCHY.md` - If adding components
- Inline comments for complex logic
- JSDoc comments for public APIs

## Need Help?

- Check [existing issues](https://github.com/your-username/flowiz-web/issues)
- Ask questions in [discussions](https://github.com/your-username/flowiz-web/discussions)
- Join our [Discord community](https://discord.gg/flowiz)

## Recognition

Contributors will be recognized in:
- `README.md` contributors section
- Release notes
- Project website

Thank you for contributing to FloWiz Web! 🎉
