import { memo, useState } from 'react'
import { Link } from 'react-router'
import { ImageOff, Star } from 'lucide-react'
import type { Product } from '@/api/schemas'
import { Badge } from '@/components/ui/badge'
import { ShortlistButton } from '@/features/shortlist'

// memo: the grid re-renders on every keystroke and filter change, but a card only needs to
// re-render when its own product changes
export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="group glass-card glow-yellow-hover relative overflow-hidden rounded-xl transition duration-200 hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="flex h-full flex-col focus-visible:outline-none">
        <div className="aspect-square overflow-hidden bg-white">
          {imageFailed ? (
            <div className="flex size-full items-center justify-center">
              <ImageOff className="size-8 text-muted-foreground" />
            </div>
          ) : (
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
          <Badge variant="secondary" className="w-fit text-accent">
            {product.category}
          </Badge>
          <h3 className="truncate text-sm font-semibold sm:text-base">{product.title}</h3>
          <p className="text-xs text-muted-foreground">{product.brand ?? ''}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-foreground">{product.rating}</span>({product.reviews.length})
          </p>
          <p className="mt-auto pt-1 text-base font-bold sm:text-lg">${product.price.toFixed(2)}</p>
        </div>
      </Link>

      {/* Sibling of the Link (not inside it) so clicking the heart doesn't navigate */}
      <ShortlistButton productId={product.id} className="absolute top-2 right-2" />
    </article>
  )
})
