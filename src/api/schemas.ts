import { z } from 'zod'

// Only the fields the app uses; Zod strips the rest and throws if the API shape changes
export const reviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
})

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string().optional(), // some DummyJSON products have no brand
  tags: z.array(z.string()),
  thumbnail: z.string(),
  images: z.array(z.string()),
  reviews: z.array(reviewSchema),
})

export const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
})

export const categoriesSchema = z.array(z.object({ slug: z.string(), name: z.string() }))

export type Review = z.infer<typeof reviewSchema>
export type Product = z.infer<typeof productSchema>
export type ProductList = z.infer<typeof productListSchema>
export type Category = z.infer<typeof categoriesSchema>[number]
