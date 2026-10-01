import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Box } from 'lucide-react'

// Shared UI: knows nothing about features, so each page passes in its own actions
export function AppHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="glow-yellow flex size-9 items-center justify-center rounded-xl bg-primary">
            <Box className="size-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-bold">Cubo Mobile</span>
        </Link>

        {actions}
      </div>
    </header>
  )
}
