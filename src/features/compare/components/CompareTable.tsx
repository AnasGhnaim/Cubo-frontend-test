import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { X } from 'lucide-react'
import type { Product } from '@/api/schemas'
import { Badge } from '@/components/ui/badge'
import { useShortlist } from '@/features/shortlist'
import { getHighlights } from '../getHighlights'

type Row = {
  label: string
  value: (p: Product) => ReactNode
  isBest?: (p: Product, best: ReturnType<typeof getHighlights>) => boolean
}

const rows: Row[] = [
  { label: 'Price', value: (p) => `$${p.price.toFixed(2)}`, isBest: (p, best) => p.price === best.price },
  { label: 'Rating', value: (p) => p.rating, isBest: (p, best) => p.rating === best.rating },
  { label: 'Stock', value: (p) => p.stock },
  { label: 'Brand', value: (p) => p.brand ?? '-' },
  { label: 'Category', value: (p) => p.category },
]

export function CompareTable({ products }: { products: Product[] }) {
  const toggle = useShortlist((s) => s.toggle)
  const best = getHighlights(products)

  return (
    <>
      {/* Mobile: one card per product */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {products.map((p) => (
          <li key={p.id} className="glass-card relative rounded-xl p-4">
            <button
              type="button"
              aria-label={`Remove ${p.title} from comparison`}
              onClick={() => toggle(p.id)}
              className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-4" />
            </button>

            <Link to={`/products/${p.id}`} className="mb-3 flex items-center gap-3 pr-6">
              <img src={p.thumbnail} alt={p.title} className="size-16 rounded-lg bg-white object-contain" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.brand ?? ''}</p>
              </div>
            </Link>

            <dl className="text-sm">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2 border-t border-border py-2">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="flex items-center gap-2">
                    {row.isBest?.(p, best) && <Badge>Best value</Badge>}
                    {row.value(p)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Tablet and up: side-by-side table */}
      <div className="glass-card hidden overflow-x-auto rounded-xl sm:block">
        <table className="w-full min-w-lg border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-28 p-3" />
              {products.map((p) => (
                <th key={p.id} className="relative p-3 text-left align-top font-normal">
                  <button
                    type="button"
                    aria-label={`Remove ${p.title} from comparison`}
                    onClick={() => toggle(p.id)}
                    className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <X className="size-4" />
                  </button>
                  <Link to={`/products/${p.id}`} className="block">
                    <img src={p.thumbnail} alt={p.title} className="mb-2 size-24 rounded-lg bg-white object-contain" />
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.brand ?? ''}</p>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <th scope="row" className="p-3 text-left font-medium text-muted-foreground">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <span className="mr-2">{row.value(p)}</span>
                    {row.isBest?.(p, best) && <Badge>Best value</Badge>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
