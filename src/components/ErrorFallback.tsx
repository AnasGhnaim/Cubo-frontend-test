import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorFallback({
  title = 'Something went wrong',
  description = "We couldn't load this. Please try again.",
  onRetry,
  className,
}: Props) {
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-3 py-20 text-center', className)}>
      <div className="flex size-16 items-center justify-center rounded-2xl border border-destructive/40 bg-card">
        <CircleAlert className="size-8 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  )
}
