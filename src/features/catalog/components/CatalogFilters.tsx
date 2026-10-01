import { Search, X } from 'lucide-react'
import type { SortKey } from '@/api/products'
import type { Category } from '@/api/schemas'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// The select needs a real value for "no category"; the URL and the API use '' for it
const ALL_CATEGORIES = 'all'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Sort by' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

// Always open below the trigger (never flip upward). The list height follows the space
// left below, so in a short window it shrinks and scrolls instead of jumping to the top.
const opensBelow = { side: 'none', align: 'shift', fallbackAxisSide: 'none' } as const

// Same look for both dropdowns: matches the search box (height, radius, background)
const triggerClass =
  'min-w-0 flex-1 rounded-xl border-input bg-secondary px-3 data-[size=default]:h-10'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  categories: Category[]
  category: string
  sort: SortKey
  hasFilters: boolean
  onCategoryChange: (value: string) => void
  onSortChange: (value: SortKey) => void
  onClear: () => void
}

export function CatalogFilters({
  search,
  onSearchChange,
  categories,
  category,
  sort,
  hasFilters,
  onCategoryChange,
  onSortChange,
  onClear,
}: Props) {
  const categoryItems = [
    { value: ALL_CATEGORIES, label: 'All Categories' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ]

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="h-10 w-full rounded-xl border border-input bg-secondary pr-3 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
      </div>

      {/* `items` lets the trigger show the label ("Laptops") instead of the value ("laptops") */}
      <Select
        items={categoryItems}
        value={category || ALL_CATEGORIES}
        onValueChange={(value) => onCategoryChange(value === ALL_CATEGORIES ? '' : String(value))}
      >
        <SelectTrigger aria-label="Category" className={`${triggerClass} sm:w-48 sm:flex-none`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          align="start"
          collisionAvoidance={opensBelow}
          className="max-h-[min(18rem,var(--available-height))]"
        >
          {categoryItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={sortOptions}
        value={sort}
        onValueChange={(value) => onSortChange(value as SortKey)}
      >
        <SelectTrigger aria-label="Sort" className={`${triggerClass} sm:w-52 sm:flex-none`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start" collisionAvoidance={opensBelow}>
          {sortOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-input px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X className="size-4" />
          Clear
        </button>
      )}
    </div>
  )
}
