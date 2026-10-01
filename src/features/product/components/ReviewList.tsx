import { Star } from 'lucide-react'
import type { Review } from '@/api/schemas'
import { cn } from '@/lib/utils'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

// Five stars, filled up to the rating. The text is for screen readers; the icons are decoration.
function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="sr-only">{rating} out of 5</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn(
            'size-4',
            n <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40',
            className,
          )}
        />
      ))}
    </span>
  )
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  // How many reviews gave 5 stars, 4 stars, ... 1 star
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }))

  return (
    <section aria-labelledby="reviews-heading" className="mt-12">
      <h2 id="reviews-heading" className="mb-5 text-xl font-semibold sm:text-2xl">
        Customer reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
          {/* Summary: stays in view while you scroll through the reviews on large screens */}
          <div className="glass-card rounded-xl p-5 lg:sticky lg:top-24">
            <p className="text-5xl font-bold">{average.toFixed(1)}</p>
            <div className="mt-2">
              <Stars rating={average} className="size-5" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>

            <ul className="mt-5 grid gap-2">
              {breakdown.map(({ stars, count }) => (
                <li key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0 text-muted-foreground">{stars} star{stars > 1 && 's'}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary" aria-hidden>
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(count / reviews.length) * 100}%` }}
                    />
                  </span>
                  <span className="w-4 text-right text-muted-foreground">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {reviews.map((review, i) => (
              <li key={i} className="glass-card flex flex-col gap-3 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary"
                  >
                    {review.reviewerName.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{review.reviewerName}</p>
                    <time dateTime={review.date} className="text-xs text-muted-foreground">
                      {formatDate(review.date)}
                    </time>
                  </div>
                </div>

                <Stars rating={review.rating} />

                <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
