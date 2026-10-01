import { Sparkles } from 'lucide-react'

export function CatalogIntro() {
  return (
    <section className="glass-card glow-yellow rounded-xl p-6 sm:p-8">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-accent">
        <Sparkles className="size-3.5" aria-hidden />
        Cubo Mobile catalogue
      </p>

      <h1 className="text-2xl font-bold sm:text-4xl">
        Find your next <span className="text-primary">favourite</span> product
      </h1>

      <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Search, filter by category and sort by price or rating. Shortlist up to four products and
        compare them side by side.
      </p>
    </section>
  )
}
