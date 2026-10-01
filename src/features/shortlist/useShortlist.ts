import { toast } from 'sonner'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const MAX_SHORTLIST = 4

type ShortlistState = {
  ids: number[]
  toggle: (id: number) => void
}

// What we accept back from localStorage; anything else is ignored
const storedSchema = z.object({ ids: z.array(z.number()) })

export const useShortlist = create<ShortlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get()

        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) })
        } else if (ids.length >= MAX_SHORTLIST) {
          toast.error(`You can shortlist up to ${MAX_SHORTLIST} products. Remove one first.`)
        } else {
          set({ ids: [...ids, id] })
        }
      },
    }),
    {
      name: 'shortlist', // localStorage key
      partialize: (state) => ({ ids: state.ids }), // store the ids, not the functions
      // Validate on load so a corrupted or hand-edited value can't break the app
      merge: (stored, current) => {
        const parsed = storedSchema.safeParse(stored)
        return parsed.success ? { ...current, ids: parsed.data.ids.slice(0, MAX_SHORTLIST) } : current
      },
    },
  ),
)

// Another tab changed the shortlist: reload it from localStorage. The browser only fires
// this event in the *other* tabs, so a tab never reacts to its own changes.
window.addEventListener('storage', (event) => {
  if (event.key === 'shortlist') useShortlist.persist.rehydrate()
})
