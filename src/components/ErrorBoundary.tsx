import { Component, type ReactNode } from 'react'
import { ErrorFallback } from './ErrorFallback'

type Props = {
  children: ReactNode
  // What to show instead of the crashed section; defaults to a compact error with a retry button
  fallback?: ReactNode
}

type State = { error: Error | null }

// Catches errors thrown while rendering its children, so one broken section shows a
// message instead of taking down the whole page. (Only a class component can do this.)
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    // The place to report to a monitoring service
    console.error('Section crashed:', error)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      this.props.fallback ?? (
        <ErrorFallback
          className="py-8"
          title="This section failed to load"
          description="The rest of the page still works."
          onRetry={() => this.setState({ error: null })}
        />
      )
    )
  }
}
