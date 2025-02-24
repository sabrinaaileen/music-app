import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.error("Error caught by Error Boundary:", error);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return <h1>Something went wrong while rendering this playlist.</h1>;
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
