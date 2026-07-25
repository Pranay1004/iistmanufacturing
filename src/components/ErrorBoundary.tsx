"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center">
            <p className="font-display text-xl font-bold text-[var(--ceramic)]">
              Something went wrong
            </p>
            <p className="mt-2 text-sm text-[var(--ceramic-muted)]">
              Please try refreshing the page.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
