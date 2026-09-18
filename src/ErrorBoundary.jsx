import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = () => {
    // Reload the page to recover from the error.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center flex-col bg-white p-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Terjadi kesalahan.</h1>
          <button
            onClick={this.handleReload}
            className="rounded bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
