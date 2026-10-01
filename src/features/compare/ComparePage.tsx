import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useProductsByIds } from '@/api/useProductsByIds'
import { EmptyState } from '@/components/EmptyState'
import { ErrorFallback } from '@/components/ErrorFallback'
import { LoadingState } from '@/components/LoadingState'
import { buttonVariants } from '@/components/ui/button'
import { useShortlist } from '@/features/shortlist'
import { CompareTable } from './components/CompareTable'

export function ComparePage() {
  const ids = useShortlist((s) => s.ids)
  const { products, isPending, isError, retry } = useProductsByIds(ids)

  if (ids.length < 2) {
    return (
      <EmptyState
        title="Nothing to compare yet"
        description="Add at least 2 products to your shortlist to compare them."
        action={
          <Link to="/shortlist" className={buttonVariants()}>
            Go to shortlist
          </Link>
        }
      />
    )
  }

  if (isPending) return <LoadingState />
  if (isError) return <ErrorFallback title="Couldn't load the products" onRetry={retry} />

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Link
        to="/shortlist"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to shortlist
      </Link>

      <h1 className="mb-5 text-2xl font-bold">Compare Products</h1>
      <CompareTable products={products} />
    </main>
  )
}
