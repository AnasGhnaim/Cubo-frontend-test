import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productQuery, updateProduct, type ProductEdit } from '@/api/products'
import type { ProductList } from '@/api/schemas'

// Optimistic update: the screen shows the new values immediately, and if the save fails
// everything goes back to exactly what it was before.
export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient()
  const productKey = productQuery(id).queryKey

  return useMutation({
    mutationFn: (edit: ProductEdit) => updateProduct(id, edit),

    onMutate: async (edit) => {
      // A fetch that is still in flight would overwrite our optimistic values when it lands
      await queryClient.cancelQueries({ queryKey: productKey })
      await queryClient.cancelQueries({ queryKey: ['products'] })

      // Remember what we are about to change, so onError can put it back
      const previousProduct = queryClient.getQueryData(productKey)
      const previousLists = queryClient.getQueriesData<ProductList>({ queryKey: ['products'] })

      // The detail page, shortlist and compare all read ['product', id]; the catalog reads
      // the ['products', ...] lists. Updating both keeps every screen consistent.
      queryClient.setQueryData(productKey, (old) => old && { ...old, ...edit })
      queryClient.setQueriesData<ProductList>({ queryKey: ['products'] }, (old) =>
        old && { ...old, products: old.products.map((p) => (p.id === id ? { ...p, ...edit } : p)) },
      )

      return { previousProduct, previousLists }
    },

    onError: (error, _edit, context) => {
      queryClient.setQueryData(productKey, context?.previousProduct)
      context?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data))
      toast.error(`Couldn't save your changes: ${error.message}. The previous values were restored.`)
    },

    onSuccess: () => toast.success('Product updated'),

    // No refetch here on purpose: DummyJSON does not store edits, so refetching would bring
    // the old values back right after we told the user the save worked.
  })
}
