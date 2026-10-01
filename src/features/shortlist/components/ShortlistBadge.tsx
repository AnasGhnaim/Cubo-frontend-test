import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import { useShortlist } from '../useShortlist'

export function ShortlistBadge() {
  const count = useShortlist((s) => s.ids.length)

  return (
    <Link
      to="/shortlist"
      aria-label={`Shortlist, ${count} items`}
      className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-secondary transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Heart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
