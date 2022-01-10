import { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-modal text-white">
          <div className="fs-3">Something went wrong 🚑</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
