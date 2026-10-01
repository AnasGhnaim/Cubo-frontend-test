import { LoaderCircle } from 'lucide-react'

// Simple placeholder for now; skeletons come in the resilience step
export function LoadingState() {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
      <LoaderCircle className="size-5 animate-spin" />
      Loading...
    </div>
  )
}
