import type { Product } from '@/api/schemas'

// The best value in each highlighted row: the cheapest price and the highest rating
export function getHighlights(products: Product[]) {
  return {
    price: Math.min(...products.map((p) => p.price)),
    rating: Math.max(...products.map((p) => p.rating)),
  }
}
