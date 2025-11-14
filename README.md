# FloWiz Web

<div align="center">

![FloWiz Logo](public/logo.svg)

**Interactive CI/CD Pipeline Visualization Tool**

[![CI/CD](https://github.com/your-username/flowiz-web/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-username/flowiz-web/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![codecov](https://codecov.io/gh/your-username/flowiz-web/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/flowiz-web)

[Demo](https://flowiz.app) • [Documentation](docs/) • [Report Bug](https://github.com/your-username/flowiz-web/issues) • [Request Feature](https://github.com/your-username/flowiz-web/issues)

</div>

---

## 🎯 Overview

FloWiz Web is a modern, interactive web application for visualizing and analyzing CI/CD pipelines. Built with React, TypeScript, and D3.js, it provides beautiful graph visualizations of your GitHub Actions and GitLab CI pipelines, helping you understand dependencies, identify bottlenecks, and optimize your workflows.

### ✨ Key Features

- 📊 **Interactive D3.js Visualizations** - Force-directed, hierarchical, and timeline layouts
- 🔍 **Pipeline Analysis** - Critical path detection, bottleneck identification, execution time estimates
- 🔄 **Real-time Updates** - Live pipeline status via WebSocket
- 🔗 **GitHub & GitLab Integration** - OAuth authentication, repository browsing, pipeline history
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🌙 **Dark Mode** - Eye-friendly dark theme
- 🚀 **Fast & Performant** - Optimized bundle size, lazy loading, code splitting

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 10+
- (Optional) Docker for containerized deployment

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

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WS_URL=http://localhost:3001
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITLAB_CLIENT_ID=your_gitlab_client_id
```

---

## 📖 Usage

### 1. Upload & Parse

Upload your GitHub Actions (`.github/workflows/*.yml`) or GitLab CI (`.gitlab-ci.yml`) configuration:

- Drag & drop the YAML file
- Or paste the content directly
- Select your platform (GitHub Actions / GitLab CI)
- Click "Parse Configuration"

### 2. Visualize

Explore the interactive graph visualization:

- **Zoom & Pan** - Mouse wheel or pinch to zoom, click and drag to pan
- **Node Interactions** - Click nodes to view details, drag to reposition
- **Layout Options** - Switch between force-directed, hierarchical, or timeline layouts
- **Export** - Save as SVG, PNG, or JSON

### 3. Analyze

View detailed analytics:

- **Execution Time** - Estimated total and per-job execution time
- **Critical Path** - Longest chain of dependent jobs
- **Bottlenecks** - Jobs that slow down your pipeline
- **Parallelization** - See which jobs can run concurrently

### 4. Integrate

Connect your GitHub or GitLab account:

- OAuth authentication
- Browse repositories
- View pipeline run history
- Real-time status updates

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18+ |
| **Language** | TypeScript 5.6+ (strict mode) |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 3 |
| **Visualization** | D3.js 7 |
| **State Management** | Zustand + React Query |
| **HTTP Client** | Axios |
| **Real-time** | Socket.io-client |
| **Routing** | React Router 6 |
| **Testing** | Vitest, React Testing Library, Playwright |
| **Code Quality** | ESLint, Prettier |
| **CI/CD** | GitHub Actions |
| **Deployment** | Docker, Nginx |

---

## 📁 Project Structure

```
flowiz-web/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base components (Button, Input, etc.)
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   └── common/          # Common components (ErrorBoundary)
│   ├── features/            # Feature modules
│   │   ├── upload/          # File upload & parsing
│   │   ├── visualization/   # D3.js graph visualization
│   │   ├── dashboard/       # Analytics dashboard
│   │   ├── integrations/    # GitHub/GitLab OAuth
│   │   └── realtime/        # WebSocket updates
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── store/               # Global state (Zustand)
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   └── styles/              # Global styles
├── tests/                   # Test suites
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   ├── COMPONENT_HIERARCHY.md
│   └── D3_VISUALIZATION_DESIGN.md
├── docker/                  # Docker configuration
└── .github/workflows/       # CI/CD pipelines
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

---

## 🔧 Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

### Code Quality

This project maintains high code quality standards:

- **TypeScript Strict Mode** - No implicit `any`, strict null checks
- **ESLint** - Enforces consistent code style
- **Prettier** - Automatic code formatting
- **Testing** - >80% unit test coverage
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Lighthouse score >90

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t flowiz-web -f docker/Dockerfile .
```

### Run Container

```bash
docker run -p 80:80 flowiz-web
```

The application will be available at `http://localhost`

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=https://api.flowiz.app/api/v1
      - VITE_WS_URL=https://api.flowiz.app
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test && npm run test:e2e`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) for powerful data visualization
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for lightning-fast build tool

---

## 📧 Contact

- **GitHub Issues**: [https://github.com/your-username/flowiz-web/issues](https://github.com/your-username/flowiz-web/issues)
- **Email**: support@flowiz.app
- **Twitter**: [@flowiz_app](https://twitter.com/flowiz_app)

---

<div align="center">

Made with ❤️ by the FloWiz Team

[⬆ back to top](#flowiz-web)

</div>
