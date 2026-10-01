import { useQueries } from '@tanstack/react-query'
import { productQuery } from './products'
import type { Product } from './schemas'

// Shortlist and compare only store ids, so they load the products through this hook.
// Each product is cached under its own key, shared with the product detail page.
export function useProductsByIds(ids: number[]) {
  const results = useQueries({ queries: ids.map((id) => productQuery(id)) })

  return {
    products: results.flatMap((r) => (r.data ? [r.data] : [])) as Product[],
    isPending: results.some((r) => r.isPending),
    isError: results.some((r) => r.isError),
    retry: () => results.forEach((r) => r.isError && r.refetch()),
  }
}
