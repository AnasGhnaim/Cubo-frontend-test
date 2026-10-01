import { createBrowserRouter, Outlet } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { NotFound } from '@/components/NotFound'
import { CatalogPage } from '@/features/catalog'
import { ComparePage } from '@/features/compare'
import { ProductPage } from '@/features/product'
import { ShortlistBadge, ShortlistPage } from '@/features/shortlist'

// Each page sits in its own boundary. The `key` gives every page a fresh boundary, so a
// crash on one page is forgotten as soon as the user navigates to another.
export const router = createBrowserRouter([
  {
    // Layout route: the header is defined once and every child page renders in <Outlet />
    element: (
      <div className="min-h-screen">
        <AppHeader
          actions={
            // If the badge crashes, the logo and the page still work
            <ErrorBoundary fallback={<span className="text-sm text-destructive">Shortlist unavailable</span>}>
              <ShortlistBadge />
            </ErrorBoundary>
          }
        />
        <Outlet />
      </div>
    ),
    // Last resort for errors outside any boundary, e.g. in the router itself
    errorElement: (
      <ErrorFallback
        title="The app hit an unexpected error"
        onRetry={() => window.location.reload()}
      />
    ),
    children: [
      { path: '/', element: <ErrorBoundary key="catalog"><CatalogPage /></ErrorBoundary> },
      { path: '/products/:id', element: <ErrorBoundary key="product"><ProductPage /></ErrorBoundary> },
      { path: '/shortlist', element: <ErrorBoundary key="shortlist"><ShortlistPage /></ErrorBoundary> },
      { path: '/compare', element: <ErrorBoundary key="compare"><ComparePage /></ErrorBoundary> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
