import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@hooks/useTheme';
import { ToastProvider } from '@components/ui/Toast';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { Header } from '@components/layout/Header';
import { Home } from '@pages/Home';
import { Upload } from '@pages/Upload';
import { Visualize } from '@pages/Visualize';
import { Dashboard } from '@pages/Dashboard';
import { Integrations } from '@pages/Integrations';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/visualize" element={<Visualize />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/integrations" element={<Integrations />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
