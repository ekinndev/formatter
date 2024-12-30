'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class JSONInputErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('JSONInput Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='p-4 border border-red-500 rounded bg-red-50 dark:bg-red-900/10'>
            <h2 className='text-red-700 dark:text-red-400 font-semibold'>Something went wrong</h2>
            <p className='text-red-600 dark:text-red-300 text-sm'>
              {this.state.error?.message || 'An error occurred while processing JSON'}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
