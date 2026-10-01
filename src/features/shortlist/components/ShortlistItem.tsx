import { Link } from 'react-router'
import { Star, Trash2 } from 'lucide-react'
import type { Product } from '@/api/schemas'
import { Button } from '@/components/ui/button'
import { useShortlist } from '../useShortlist'

// Card on mobile (image on top), horizontal row from `sm` up
export function ShortlistItem({ product }: { product: Product }) {
  const toggle = useShortlist((s) => s.toggle)

  return (
    <li className="glass-card relative flex flex-col overflow-hidden rounded-xl sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <Link
        to={`/products/${product.id}`}
        className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-4"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="aspect-square w-full bg-white object-contain sm:size-24 sm:shrink-0 sm:rounded-lg"
        />
        <div className="min-w-0 p-3 sm:p-0">
          <h3 className="truncate text-sm font-semibold sm:text-base">{product.title}</h3>
          <p className="text-xs text-muted-foreground">{product.brand ?? ''}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            {product.rating} ({product.reviews.length})
          </p>
          <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
        </div>
      </Link>

      <Button
        variant="destructive"
        size="icon"
        aria-label={`Remove ${product.title} from shortlist`}
        onClick={() => toggle(product.id)}
        className="absolute top-2 right-2 sm:static"
      >
        <Trash2 />
      </Button>
    </li>
  )
}
