import { useEffect, useState } from 'react'
import { useNavigationType, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { categoriesQuery, PAGE_SIZE, productsQuery, type ProductsParams } from '@/api/products'
import { EmptyState } from '@/components/EmptyState'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorFallback } from '@/components/ErrorFallback'
import { LoadingState } from '@/components/LoadingState'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/lib/useDebounce'
import { CatalogFilters } from './components/CatalogFilters'
import { CatalogIntro } from './components/CatalogIntro'
import { Pagination } from './components/Pagination'
import { ProductCard } from './components/ProductCard'
import { parseParams, toSearchParams } from './params'

export function CatalogPage() {
  // The URL is the source of truth for search, category, sort and page
  const [searchParams, setSearchParams] = useSearchParams()
  const params = parseParams(searchParams)

  // What the user is typing right now; it only reaches the URL once they pause
  const [search, setSearch] = useState(params.q)
  const debouncedSearch = useDebounce(search).trim()
  const navigationType = useNavigationType()

  // Back/forward changed the URL: show its search text in the input. Our own URL updates
  // are never 'POP', so this can't overwrite what the user is typing
  const [previousQ, setPreviousQ] = useState(params.q)
  if (params.q !== previousQ) {
    setPreviousQ(params.q)
    if (navigationType === 'POP') setSearch(params.q)
  }

  // Typing has settled (the debounce caught up with the input): write it to the URL
  useEffect(() => {
    if (debouncedSearch === search.trim() && debouncedSearch !== params.q) {
      setSearchParams((prev) => toSearchParams({ ...parseParams(prev), q: debouncedSearch, page: 1 }))
    }
  }, [debouncedSearch, search, params.q, setSearchParams])

  // Every change goes through the URL (one history entry each) and returns to page 1,
  // unless the change is the page itself
  const update = (changes: Partial<ProductsParams>) =>
    setSearchParams(toSearchParams({ ...params, page: 1, ...changes }))

  const clearFilters = () => {
    setSearch('')
    setSearchParams(new URLSearchParams())
  }

  const { data: categories = [] } = useQuery(categoriesQuery)
  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery(productsQuery(params))

  // The grid still shows the previous results while the input has moved on or the
  // next request is loading, so we dim it instead of pretending it matches the input
  const isOutOfDate = search.trim() !== params.q || isPlaceholderData

  const hasFilters = Boolean(search || params.category || params.sort !== 'default')

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6">
      <CatalogIntro />

      {/* Filters and results are separate sections: if one crashes the other keeps working */}
      <ErrorBoundary>
        <CatalogFilters
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          category={params.category}
          sort={params.sort}
          hasFilters={hasFilters}
          onCategoryChange={(category) => update({ category })}
          onSortChange={(sort) => update({ sort })}
          onClear={clearFilters}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorFallback
            title="Couldn't load products"
            description="Check your connection and try again."
            onRetry={refetch}
          />
        ) : (
          <>
            <p role="status" className="text-sm text-muted-foreground">
              {data.total} {data.total === 1 ? 'product' : 'products'} found
            </p>

            {data.products.length === 0 && data.total > 0 ? (
              // A link like ?page=999 points past the last page
              <EmptyState
                title="That page doesn't exist"
                description="There are no products this far down the list."
                action={<Button onClick={() => update({ page: 1 })}>Go to first page</Button>}
              />
            ) : data.products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try changing your search or filters."
                action={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            ) : (
              <div
                aria-busy={isOutOfDate}
                className={cn(
                  'grid grid-cols-2 gap-3 transition-opacity sm:gap-5 md:grid-cols-3 lg:grid-cols-4',
                  isOutOfDate && 'opacity-50',
                )}
              >
                {data.products.map((product) => (
                  // One bad product shows a placeholder instead of breaking the whole grid
                  <ErrorBoundary
                    key={product.id}
                    fallback={
                      <div className="glass-card rounded-xl p-4 text-sm text-muted-foreground">
                        This product can't be displayed.
                      </div>
                    }
                  >
                    <ProductCard product={product} />
                  </ErrorBoundary>
                ))}
              </div>
            )}

            <Pagination
              page={params.page}
              totalPages={Math.max(1, Math.ceil(data.total / PAGE_SIZE))}
              onPageChange={(page) => update({ page })}
            />
          </>
        )}
      </ErrorBoundary>
    </main>
  )
}
