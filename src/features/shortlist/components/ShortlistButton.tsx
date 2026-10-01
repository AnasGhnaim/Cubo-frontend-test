import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useShortlist } from '../useShortlist'

export function ShortlistButton({ productId, className }: { productId: number; className?: string }) {
  const active = useShortlist((s) => s.ids.includes(productId))
  const toggle = useShortlist((s) => s.toggle)

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={active ? 'Remove from shortlist' : 'Add to shortlist'}
      className={cn(
        'flex size-8 items-center justify-center rounded-full bg-background/60 backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      <Heart className={cn('size-4', active ? 'fill-primary text-primary' : 'text-foreground')} />
    </button>
  )
}
