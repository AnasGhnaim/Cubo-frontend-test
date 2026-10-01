import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { client } from './client'
import { categoriesSchema, productListSchema, productSchema, type Product } from './schemas'

export const PAGE_SIZE = 12

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating'
export type ProductsParams = { q: string; category: string; sort: SortKey; page: number }

const sortParams = {
  default: {},
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  rating: { sortBy: 'rating', order: 'desc' },
}

const matches = (p: Product, q: string) =>
  `${p.title} ${p.brand ?? ''}`.toLowerCase().includes(q.toLowerCase())

async function getProducts({ q, category, sort, page }: ProductsParams, signal: AbortSignal) {
  const skip = (page - 1) * PAGE_SIZE
  const sortBy = sortParams[sort]

  // DummyJSON can't combine search with a category, so for both we fetch the whole
  // category (it's small) and filter and paginate it here
  if (q && category) {
    const { data } = await client.get(`/products/category/${encodeURIComponent(category)}`, {
      params: { limit: 0, ...sortBy },
      signal,
    })
    const all = productListSchema.parse(data).products.filter((p) => matches(p, q))
    return { products: all.slice(skip, skip + PAGE_SIZE), total: all.length }
  }

  const url = q
    ? '/products/search'
    : category
      ? `/products/category/${encodeURIComponent(category)}`
      : '/products'
  const { data } = await client.get(url, {
    params: { q: q || undefined, limit: PAGE_SIZE, skip, ...sortBy },
    signal,
  })
  return productListSchema.parse(data)
}

async function getProduct(id: number, signal: AbortSignal) {
  const { data } = await client.get(`/products/${id}`, { signal })
  return productSchema.parse(data)
}

async function getCategories(signal: AbortSignal) {
  const { data } = await client.get('/products/categories', { signal })
  return categoriesSchema.parse(data)
}

// The query key contains every input, so a new search/filter/page is a new cache entry.
// React Query also aborts the old request through `signal`, so a slow old response can
// never overwrite the newer one.
export const productsQuery = (params: ProductsParams) =>
  queryOptions({
    queryKey: ['products', params],
    queryFn: ({ signal }) => getProducts(params, signal),
    placeholderData: keepPreviousData, // keep showing the old page while the next loads
  })

export const productQuery = (id: number) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProduct(id, signal),
  })

export const categoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn: ({ signal }) => getCategories(signal),
  staleTime: Infinity, // categories practically never change
})

export type ProductEdit = Pick<Product, 'title' | 'price'>

// DummyJSON echoes the edit back but does not actually store it
export async function updateProduct(id: number, edit: ProductEdit) {
  const { data } = await client.put(`/products/${id}`, edit)
  return productSchema.pick({ id: true, title: true, price: true }).parse(data)
}
