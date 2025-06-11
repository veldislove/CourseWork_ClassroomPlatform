import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-6">
          <h2>Помилка рендерингу</h2>
          <p>{this.state.error?.message || "Щось пішло не так."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
