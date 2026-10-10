import { Component, useState, type ErrorInfo, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

interface ErrorBoundaryState {
  hasError: boolean;
}
interface ErrorBoundaryProps {
  children: ReactNode;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    toast.error('Algo no salió como esperábamos.', {
      description: `${error.message}${info.componentStack ?? ''}`,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error-page">
          <span>🧩</span>
          <h2>Podemos intentarlo de nuevo</h2>
          <p>Hubo un problema inesperado, pero tu progreso guardado sigue a salvo.</p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => this.setState({ hasError: false })}
          >
            Volver a intentarlo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 1000 * 60 * 60,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AppErrorBoundary>
    </QueryClientProvider>
  );
}
