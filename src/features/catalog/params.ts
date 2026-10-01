import type { ProductsParams, SortKey } from '@/api/products'

const sortKeys: SortKey[] = ['default', 'price-asc', 'price-desc', 'rating']

// URL -> params. Anything missing or invalid falls back to a default, so a hand-edited
// link like ?page=abc&sort=foo still opens a sensible view
export function parseParams(searchParams: URLSearchParams): ProductsParams {
  const page = Number(searchParams.get('page'))
  return {
    q: searchParams.get('q')?.trim() ?? '',
    category: searchParams.get('category') ?? '',
    sort: sortKeys.find((s) => s === searchParams.get('sort')) ?? 'default',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

// params -> URL. Defaults are left out to keep shared links short
export function toSearchParams({ q, category, sort, page }: ProductsParams) {
  const searchParams = new URLSearchParams()
  if (q) searchParams.set('q', q)
  if (category) searchParams.set('category', category)
  if (sort !== 'default') searchParams.set('sort', sort)
  if (page > 1) searchParams.set('page', String(page))
  return searchParams
}
