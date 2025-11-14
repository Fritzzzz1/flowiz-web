import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <div className="text-center space-y-6">
              <div className="text-6xl">⚠️</div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We encountered an unexpected error. Don't worry, our team has been notified.
                </p>
              </div>

              {this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    View error details
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={this.handleReset} variant="primary">
                  Try Again
                </Button>
                <Button onClick={() => (window.location.href = '/')} variant="secondary">
                  Go to Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
