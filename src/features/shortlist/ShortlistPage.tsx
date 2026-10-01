import { Link } from 'react-router'
import { GitCompareArrows } from 'lucide-react'
import { useProductsByIds } from '@/api/useProductsByIds'
import { EmptyState } from '@/components/EmptyState'
import { ErrorFallback } from '@/components/ErrorFallback'
import { LoadingState } from '@/components/LoadingState'
import { Button, buttonVariants } from '@/components/ui/button'
import { ShortlistItem } from './components/ShortlistItem'
import { useShortlist } from './useShortlist'

export function ShortlistPage() {
  const ids = useShortlist((s) => s.ids)
  const { products, isPending, isError, retry } = useProductsByIds(ids)

  if (ids.length === 0) {
    return (
      <EmptyState
        title="Your shortlist is empty"
        description="Tap the heart on a product to save it here."
        action={
          <Link to="/" className={buttonVariants()}>
            Browse products
          </Link>
        }
      />
    )
  }

  if (isPending) return <LoadingState />
  if (isError) return <ErrorFallback title="Couldn't load your shortlist" onRetry={retry} />

  const canCompare = products.length >= 2

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">My Shortlist ({products.length})</h1>
      <p className="mb-5 text-sm text-muted-foreground">Save up to 4 products and compare them side by side.</p>

      <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-col">
        {products.map((product) => (
          <ShortlistItem key={product.id} product={product} />
        ))}
      </ul>

      <div className="glass-card mt-6 flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Compare selected products</p>
          <p className="text-sm text-muted-foreground">
            {canCompare ? 'Compare price and rating side by side.' : 'Add at least 2 products to compare.'}
          </p>
        </div>

        {canCompare ? (
          <Link to="/compare" className={buttonVariants({ size: 'lg' })}>
            <GitCompareArrows />
            Compare ({products.length})
          </Link>
        ) : (
          <Button size="lg" disabled>
            <GitCompareArrows />
            Compare
          </Button>
        )}
      </div>
    </main>
  )
}
