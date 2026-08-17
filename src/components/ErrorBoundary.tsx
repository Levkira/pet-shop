import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error in a routed page:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="font-display text-2xl text-ink">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink/60">
            This page hit an unexpected error. You can try again, or head
            back home.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-full bg-mustard px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-mustard/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-sand"
            >
              Back home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
