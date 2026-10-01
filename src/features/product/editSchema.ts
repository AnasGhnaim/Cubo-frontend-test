import { z } from 'zod'

export const editSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be 100 characters or fewer'),
  price: z
    .number({ error: 'Price must be a number' })
    .positive('Price must be greater than 0')
    .max(1_000_000, 'Price is too high'),
})
