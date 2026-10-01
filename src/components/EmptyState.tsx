import type { ReactNode } from 'react'
import { PackageSearch } from 'lucide-react'

type Props = { title: string; description: string; action?: ReactNode }

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
        <PackageSearch className="size-8 text-accent" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
