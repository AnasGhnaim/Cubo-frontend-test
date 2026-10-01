import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Heart, Star } from 'lucide-react'
import type { Product } from '@/api/schemas'
import { Badge } from '@/components/ui/badge'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { useShortlist } from '@/features/shortlist'
import { cn } from '@/lib/utils'
import { EditProductDialog } from './EditProductDialog'
import { ReviewList } from './ReviewList'

export function ProductDetail({ product }: { product: Product }) {
  const inShortlist = useShortlist((s) => s.ids.includes(product.id))
  const toggle = useShortlist((s) => s.toggle)
  const [selectedImage, setSelectedImage] = useState(0)

  const images = product.images.length > 0 ? product.images : [product.thumbnail]

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to catalog
      </Link>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="flex flex-col gap-3">
          <div className="glass-card aspect-square overflow-hidden rounded-xl">
            <img
              src={images[selectedImage]}
              alt={`${product.title}, image ${selectedImage + 1} of ${images.length}`}
              className="size-full bg-white object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === selectedImage}
                  className={cn(
                    'size-16 shrink-0 overflow-hidden rounded-lg border bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    i === selectedImage ? 'border-primary' : 'border-border',
                  )}
                >
                  <img src={src} alt="" className="size-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit text-accent">
            {product.category}
          </Badge>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>
              {product.brand && <p className="text-muted-foreground">{product.brand}</p>}
            </div>
            <ErrorBoundary fallback={<span className="text-sm text-destructive">Editing unavailable</span>}>
              <EditProductDialog product={product} />
            </ErrorBoundary>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{product.rating}</span>
            ({product.reviews.length} reviews)
          </p>

          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          <p className={cn('text-sm', product.stock > 0 ? 'text-green-400' : 'text-destructive')}>
            {product.stock > 0 ? `In stock · ${product.stock} available` : 'Out of stock'}
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Button
            size="lg"
            variant={inShortlist ? 'outline' : 'default'}
            onClick={() => toggle(product.id)}
            className="glow-yellow mt-2 h-11 text-base"
          >
            <Heart className={cn('size-4', inShortlist && 'fill-primary text-primary')} />
            {inShortlist ? 'Remove from shortlist' : 'Add to shortlist'}
          </Button>
        </div>
      </div>

      <ErrorBoundary>
        <ReviewList reviews={product.reviews} />
      </ErrorBoundary>
    </main>
  )
}
