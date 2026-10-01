import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4">
      <Button variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button variant="outline" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
