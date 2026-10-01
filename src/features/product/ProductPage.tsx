import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { isNotFound } from '@/api/errors'
import { productQuery } from '@/api/products'
import { ErrorFallback } from '@/components/ErrorFallback'
import { LoadingState } from '@/components/LoadingState'
import { NotFound } from '@/components/NotFound'
import { ProductDetail } from './components/ProductDetail'

export function ProductPage() {
  const productId = Number(useParams().id)
  const isValidId = Number.isInteger(productId) && productId > 0

  // only the id=number will be accessable rather than this it will return not found in that way I save requests
  const { data: product, error, isPending, refetch } = useQuery({
    ...productQuery(productId),
    enabled: isValidId,
  })

  if (!isValidId || isNotFound(error)) {
    return <NotFound title="Product not found" description="This product doesn't exist." />
  }
  if (isPending) return <LoadingState />
  if (error) return <ErrorFallback title="Couldn't load this product" onRetry={refetch} />

  return <ProductDetail product={product} />
}
