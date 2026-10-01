import { useRef, useState, type FormEvent } from 'react'
import { Pencil } from 'lucide-react'
import type { Product } from '@/api/schemas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { editSchema } from '../editSchema'
import { useUpdateProduct } from '../useUpdateProduct'

const inputClass =
  'h-10 w-full rounded-xl border bg-secondary px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'

export function EditProductDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useUpdateProduct(product.id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Disabled while a save is in flight, so two edits can't overlap */}
      <DialogTrigger render={<Button variant="outline" disabled={isPending} />}>
        <Pencil />
        Edit
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>Change the title or the price of {product.title}.</DialogDescription>
        </DialogHeader>

        {/* Mounted only while open, so the fields always start from the current values */}
        <EditForm
          product={product}
          onSubmit={(edit) => {
            // Nothing changed: skip the request
            if (edit.title !== product.title || edit.price !== product.price) mutate(edit)
            setOpen(false) // close right away: the screen already shows the new values
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

type FormProps = {
  product: Product
  onSubmit: (edit: { title: string; price: number }) => void
}

function EditForm({ product, onSubmit }: FormProps) {
  const [title, setTitle] = useState(product.title)
  const [price, setPrice] = useState(String(product.price))
  const [errors, setErrors] = useState<{ title?: string; price?: string }>({})
  const titleRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const result = editSchema.safeParse({
      title,
      price: price.trim() === '' ? NaN : Number(price),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({ title: fieldErrors.title?.[0], price: fieldErrors.price?.[0] })
      // Move focus to the first field with a problem
      ;(fieldErrors.title ? titleRef : priceRef).current?.focus()
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="edit-title" className="font-medium">
          Title
        </label>
        <input
          id="edit-title"
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'edit-title-error' : undefined}
          className={cn(inputClass, errors.title ? 'border-destructive' : 'border-input')}
        />
        {errors.title && (
          <p id="edit-title-error" role="alert" className="text-xs text-destructive">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="edit-price" className="font-medium">
          Price ($)
        </label>
        <input
          id="edit-price"
          ref={priceRef}
          type="number"
          step="0.01"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-invalid={Boolean(errors.price)}
          aria-describedby={errors.price ? 'edit-price-error' : undefined}
          className={cn(inputClass, errors.price ? 'border-destructive' : 'border-input')}
        />
        {errors.price && (
          <p id="edit-price-error" role="alert" className="text-xs text-destructive">
            {errors.price}
          </p>
        )}
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}
